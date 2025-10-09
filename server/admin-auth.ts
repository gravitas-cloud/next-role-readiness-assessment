import { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { Admin } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      admin?: Admin;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRY = "7d";

// Verify admin JWT token and attach admin to request
export async function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.adminAuthToken;

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string; email: string };
    const admin = await storage.getAdminByEmail(decoded.email);
    
    if (!admin) {
      return res.sendStatus(401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}

export function setupAdminAuth(app: Express) {
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required"),
      });
      
      const { email, password } = loginSchema.parse(req.body);

      // Find admin
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { adminId: admin.id, email: admin.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      // Set httpOnly cookie
      res.cookie("adminAuthToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Return admin without password
      const { password: _, ...adminWithoutPassword } = admin;
      res.status(200).json(adminWithoutPassword);
    } catch (error) {
      console.error("Admin login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get current admin
  app.get("/api/admin/me", authenticateAdmin, (req, res) => {
    const { password: _, ...adminWithoutPassword } = req.admin!;
    res.json(adminWithoutPassword);
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie("adminAuthToken");
    res.sendStatus(200);
  });
}

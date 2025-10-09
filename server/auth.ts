import { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { storage } from "./storage";
import { User, insertUserSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRY = "7d"; // 7 days as per requirements

// Hash password with bcrypt (10 rounds as per requirements)
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Compare password with hash
export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  return await bcrypt.compare(supplied, stored);
}

// Generate JWT token
export function generateToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
  };
  // Let jsonwebtoken manage iat automatically
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

// Verify JWT token and attach user to request
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; iat: number; exp: number };
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user;
    
    // Refresh token if within 24hrs of expiry (iat and exp are in seconds)
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    const oneDayInSeconds = 24 * 60 * 60;
    const timeToExpiry = decoded.exp - currentTime;
    
    // Issue new token if less than 24 hours until expiry
    if (timeToExpiry < oneDayInSeconds) {
      const newToken = generateToken(user);
      res.cookie("authToken", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      });
    }
    
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}

export function setupAuth(app: Express) {
  // Add cookie parser middleware
  app.use(cookieParser());

  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate request body with Zod
      const validatedData = insertUserSchema.parse(req.body);
      const { email, name, password } = validatedData;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        name,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = generateToken(user);

      // Set httpOnly cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Validate request body using shared schema
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await comparePasswords(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = generateToken(user);

      // Set httpOnly cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, (req, res) => {
    const { password: _, ...userWithoutPassword } = req.user!;
    res.json(userWithoutPassword);
  });

  // Logout user
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("authToken");
    res.sendStatus(200);
  });
}

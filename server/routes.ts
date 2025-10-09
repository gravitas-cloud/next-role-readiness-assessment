import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, authenticateToken } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Assessment routes will be added here
  // Admin routes will be added here
  // MailerLite routes will be added here

  const httpServer = createServer(app);

  return httpServer;
}

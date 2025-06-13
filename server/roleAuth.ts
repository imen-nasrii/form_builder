import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

// Middleware to require email verification
export const requireEmailVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ 
        message: "Email verification required",
        requiresEmailVerification: true 
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to require admin role
export const requireAdminRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ 
        message: "Email verification required",
        requiresEmailVerification: true 
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to require user role
export const requireUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.session as any)?.userId;
    console.log("Session data:", { userId, session: req.session });
    
    if (!userId) {
      console.log("No userId in session");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    console.log("User from database:", user);
    
    if (!user || !user.isActive) {
      console.log("User not found or inactive");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user.emailVerified) {
      console.log("Email not verified");
      return res.status(403).json({ 
        message: "Email verification required",
        requiresEmailVerification: true 
      });
    }

    if (user.role !== 'user') {
      console.log("User role is not 'user':", user.role);
      return res.status(403).json({ message: "User access required" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("User auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
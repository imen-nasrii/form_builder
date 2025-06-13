import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Enhanced authentication middleware with email verification requirements
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

    // Require email verification for all users (no development bypass)
    if (!user.emailVerified) {
      return res.status(401).json({ 
        message: "Please verify your email before accessing this feature",
        requireEmailVerification: true 
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin-only access (with email verification)
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user || !user.isActive || !user.emailVerified) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User-only access (with email verification)
export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user || !user.isActive || !user.emailVerified) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== 'user') {
      return res.status(403).json({ message: "User access required" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("User auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Role-based permissions for programs
export const programPermissions = {
  // Admin can: view all programs, accept/reject programs, assign programs to users
  admin: {
    canViewAllPrograms: true,
    canAcceptPrograms: true,
    canAssignPrograms: true,
    canViewStatistics: true,
    canAccessComponents: true,
    canCreatePrograms: false,
    canEditOwnPrograms: false,
    canViewProgress: true
  },
  
  // User can: create programs, edit own programs, view own progress, stop programs
  user: {
    canViewAllPrograms: false,
    canAcceptPrograms: false,
    canAssignPrograms: false,
    canViewStatistics: false,
    canAccessComponents: false,
    canCreatePrograms: true,
    canEditOwnPrograms: true,
    canViewProgress: true,
    canStopPrograms: true
  }
};

// Check specific permission
export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userPermissions = programPermissions[user.role as keyof typeof programPermissions];
    if (!userPermissions || !userPermissions[permission as keyof typeof userPermissions]) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
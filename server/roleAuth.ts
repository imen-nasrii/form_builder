import type { Request, Response, NextFunction } from 'express';

// Middleware to require email verification
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  if (!user.emailVerified) {
    return res.status(403).json({ 
      message: "Email verification required",
      requiresEmailVerification: true 
    });
  }
  
  next();
};

// Middleware to require admin role
export const requireAdminRole = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user) {
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
  
  next();
};

// Middleware to require user role
export const requireUserRole = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  if (!user.emailVerified) {
    return res.status(403).json({ 
      message: "Email verification required",
      requiresEmailVerification: true 
    });
  }
  
  if (user.role !== 'user') {
    return res.status(403).json({ message: "User access required" });
  }
  
  next();
};
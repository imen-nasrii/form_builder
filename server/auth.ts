import bcrypt from "bcryptjs";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import crypto from "crypto";

export function setupAuth(app: Express) {
  // Session configuration
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
    schemaName: "public",
  });

  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: 'connect.sid',
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
  }));

  // Auth routes
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, role = 'user' } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user (no email verification required)
      const user = await storage.createUser({
        id: nanoid(),
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        profileImageUrl: null,
        role: role,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        isActive: true,
      });

      // Create session
      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session
      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;
      (req.session as any).userEmail = user.email;

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).redirect("/?error=logout_failed");
      }
      res.clearCookie('connect.sid');
      res.redirect("/");
    });
  });

  // POST logout for frontend
  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/user", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any)?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Setup 2FA for admins
  app.post("/api/auth/setup-2fa", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any)?.userId;
      const userRole = (req.session as any)?.userRole;
      
      if (!userId || userRole !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.twoFactorEnabled) {
        return res.status(400).json({ message: "2FA already enabled" });
      }

      // Import 2FA service
      const { twoFactorService } = await import('./services/twoFactorService');
      
      // Generate real 2FA secret and QR code
      const setup = await twoFactorService.generateSecret(user.email, 'FormCraft Pro');
      
      // Store the temporary secret in session for verification
      (req.session as any).tempTwoFactorSecret = setup.secret;

      res.json({
        secret: setup.secret,
        qrCode: setup.qrCode,
        backupCodes: setup.backupCodes
      });
    } catch (error) {
      console.error("2FA setup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Verify and enable 2FA  
  app.post("/api/auth/verify-2fa", async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const userId = (req.session as any)?.userId;
      const tempSecret = (req.session as any)?.tempTwoFactorSecret;
      
      if (!userId || !tempSecret) {
        return res.status(400).json({ message: "Invalid 2FA setup session" });
      }

      const { twoFactorService } = await import('./services/twoFactorService');
      
      // Verify the token
      const isValid = twoFactorService.verifyToken(tempSecret, token);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid 2FA token" });
      }

      // Enable 2FA for the user
      await storage.enableTwoFactor(userId, tempSecret);
      
      // Clear temporary secret
      delete (req.session as any).tempTwoFactorSecret;

      res.json({ message: "2FA enabled successfully" });
    } catch (error) {
      console.error("2FA verification error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Disable 2FA
  app.post("/api/auth/disable-2fa", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any)?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.disableTwoFactor(userId);
      res.json({ message: "2FA disabled successfully" });
    } catch (error) {
      console.error("2FA disable error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Password reset request
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not
        return res.json({ message: "If an account with that email exists, we've sent a password reset link." });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.createPasswordResetToken({
        userId: user.id,
        token: resetToken,
        expiresAt,
        used: false,
      });

      // TODO: Send email with reset link
      // For now, just return success
      res.json({ message: "If an account with that email exists, we've sent a password reset link." });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reset password with token
  app.post("/api/auth/reset-password/:token", async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password || password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      const userId = await storage.verifyPasswordResetToken(token);
      if (!userId) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);
      await storage.updateUserPassword(userId, hashedPassword);
      await storage.markPasswordResetTokenUsed(token);

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Password reset completion error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

// Middleware to check if user is authenticated
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.session as any)?.userId;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  next();
};

// Middleware to check if user is admin
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.session as any)?.userId;
    const userRole = (req.session as any)?.userRole;
    
    if (!userId || userRole !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    // Double-check from database
    const user = await storage.getUser(userId);
    if (!user || user.role !== 'admin' || !user.isActive) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
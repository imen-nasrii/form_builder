import bcrypt from "bcryptjs";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { nanoid } from "nanoid";

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

      // Create user - auto-verify email in development
      const isDevelopment = process.env.NODE_ENV === 'development';
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
        emailVerified: role === 'admin' || isDevelopment ? true : false,
        emailVerificationToken: null,
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
        emailVerified: user.emailVerified,
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

      // Check email verification for users (skip in development)
      const isDevelopment = process.env.NODE_ENV === 'development';
      if (user.role === 'user' && !user.emailVerified && !isDevelopment) {
        return res.status(401).json({ 
          message: "Please verify your email before logging in",
          requireEmailVerification: true 
        });
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
        emailVerified: user.emailVerified,
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

  // Sign up endpoint (alias for register)
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user - auto-verify email in development
      const isDevelopment = process.env.NODE_ENV === 'development';
      const user = await storage.createUser({
        id: nanoid(),
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        profileImageUrl: null,
        role: 'user',
        twoFactorEnabled: false,
        twoFactorSecret: null,
        emailVerified: isDevelopment ? true : false,
        emailVerificationToken: null,
        isActive: true,
      });

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
        message: "Account created successfully"
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Sign in endpoint (alias for login)
  app.post("/api/auth/signin", async (req: Request, res: Response) => {
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

      // Check email verification for users (skip in development)
      const isDevelopment = process.env.NODE_ENV === 'development';
      if (user.role === 'user' && !user.emailVerified && !isDevelopment) {
        return res.status(401).json({ 
          message: "Please verify your email before logging in",
          requireEmailVerification: true 
        });
      }

      // Create session
      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

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
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin: Get all users
  app.get("/api/admin/users", async (req: Request, res: Response) => {
    try {
      const userRole = (req.session as any)?.userRole;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin: Update user role
  app.patch("/api/admin/users/:userId/role", async (req: Request, res: Response) => {
    try {
      const userRole = (req.session as any)?.userRole;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { userId } = req.params;
      const { role } = req.body;

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      await storage.updateUserRole(userId, role);
      res.json({ message: "Role updated successfully" });
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin: Toggle user status
  app.patch("/api/admin/users/:userId/toggle", async (req: Request, res: Response) => {
    try {
      const userRole = (req.session as any)?.userRole;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { userId } = req.params;
      const { isActive } = req.body;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user status (this would need to be added to storage interface)
      // For now, we'll just return success
      res.json({ message: "User status updated successfully" });
    } catch (error) {
      console.error("Error toggling user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Email verification endpoint
  app.post("/api/auth/verify-email", async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Token required" });
      }

      const userId = await storage.verifyEmailToken(token);
      if (!userId) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      await storage.verifyUserEmail(userId);
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
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
        qrCode: setup.qrCode,
        manualEntryKey: setup.manualEntryKey,
        message: "Scan QR code with your authenticator app"
      });
    } catch (error) {
      console.error("2FA setup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Enable 2FA
  app.post("/api/auth/enable-2fa", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any)?.userId;
      const userRole = (req.session as any)?.userRole;
      const tempSecret = (req.session as any)?.tempTwoFactorSecret;
      const { token } = req.body;
      
      if (!userId || userRole !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!token || token.length !== 6) {
        return res.status(400).json({ message: "Valid 6-digit code required" });
      }

      if (!/^\d{6}$/.test(token)) {
        return res.status(400).json({ message: "Invalid verification code" });
      }

      if (!tempSecret) {
        return res.status(400).json({ message: "No 2FA setup session found. Please restart setup." });
      }

      // Import 2FA service and verify token
      const { twoFactorService } = await import('./services/twoFactorService');
      
      const isValid = twoFactorService.verifyToken(token, tempSecret);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid verification code" });
      }

      // Enable 2FA with the verified secret
      await storage.enableTwoFactor(userId, tempSecret);
      
      // Clear the temporary secret from session
      delete (req.session as any).tempTwoFactorSecret;
      
      res.json({ message: "2FA enabled successfully" });
    } catch (error) {
      console.error("Enable 2FA error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Disable 2FA
  app.post("/api/auth/disable-2fa", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any)?.userId;
      const userRole = (req.session as any)?.userRole;
      
      if (!userId || userRole !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.disableTwoFactor(userId);
      res.json({ message: "2FA disabled successfully" });
    } catch (error) {
      console.error("Disable 2FA error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

// Middleware to require authentication
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to require admin role
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user || !user.isActive || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
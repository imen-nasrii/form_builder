import { Request, Response, NextFunction, Express } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { twoFactorService } from "./services/twoFactorService";
import { z } from "zod";

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  twoFactorToken: z.string().optional(),
});



const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const enable2FASchema = z.object({
  token: z.string().length(6),
});

// Session interface
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    twoFactorEnabled: boolean;
  };
}

export function setupEnhancedAuth(app: Express) {
  // Register new user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, role } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Un compte avec cet email existe déjà" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Generate user ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      // Create user (no email verification required)
      const newUser = await storage.createUser({
        id: userId,
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        profileImageUrl: null,
        role,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        isActive: true,
      });

      // Create session immediately
      (req.session as any).userId = newUser.id;
      (req.session as any).userRole = newUser.role;

      res.status(201).json({
        message: "Compte créé avec succès",
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Erreur lors de la création du compte" });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password, twoFactorToken } = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }



      // Check 2FA for admins
      if (user.role === 'admin' && user.twoFactorEnabled) {
        if (!twoFactorToken) {
          return res.status(401).json({ 
            message: "Code d'authentification à deux facteurs requis",
            require2FA: true 
          });
        }

        const validToken = twoFactorService.verifyToken(twoFactorToken, user.twoFactorSecret!);
        if (!validToken) {
          return res.status(401).json({ message: "Code d'authentification invalide" });
        }
      }

      // Create session
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      };

      res.json({
        message: "Connexion réussie",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });



  // Forgot password
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists
        return res.json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé" });
      }

      // For now, forgot password is disabled as we removed email service
      // You can implement this later with your preferred email provider

      res.json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Erreur lors de l'envoi" });
    }
  });

  // Reset password (simplified - no email verification)
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      res.status(400).json({ message: "Fonctionnalité temporairement désactivée" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Erreur lors de la réinitialisation" });
    }
  });

  // Setup 2FA (admin only)
  app.post("/api/auth/setup-2fa", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      if (user.twoFactorEnabled) {
        return res.status(400).json({ message: "2FA déjà activé" });
      }

      const setup = twoFactorService.generateSecret(user.email);
      const qrCode = await twoFactorService.generateQRCode(setup.qrCodeUrl);

      res.json({
        qrCode,
        manualEntryKey: setup.manualEntryKey,
        message: "Scannez le QR code avec votre application d'authentification"
      });
    } catch (error) {
      console.error("2FA setup error:", error);
      res.status(500).json({ message: "Erreur lors de la configuration 2FA" });
    }
  });

  // Enable 2FA (admin only)
  app.post("/api/auth/enable-2fa", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { token } = enable2FASchema.parse(req.body);
      
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // This is a temporary secret stored in session during setup
      const tempSecret = (req.session as any).tempTwoFactorSecret;
      if (!tempSecret) {
        return res.status(400).json({ message: "Configuration 2FA non initiée" });
      }

      const validToken = twoFactorService.verifyToken(token, tempSecret);
      if (!validToken) {
        return res.status(400).json({ message: "Code de vérification invalide" });
      }

      // Enable 2FA
      await storage.enableTwoFactor(user.id, tempSecret);
      

      
      // Clear temporary secret
      delete (req.session as any).tempTwoFactorSecret;
      
      res.json({ message: "Authentification à deux facteurs activée" });
    } catch (error) {
      console.error("Enable 2FA error:", error);
      res.status(500).json({ message: "Erreur lors de l'activation 2FA" });
    }
  });

  // Disable 2FA (admin only)
  app.post("/api/auth/disable-2fa", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      await storage.disableTwoFactor(req.user!.id);
      res.json({ message: "Authentification à deux facteurs désactivée" });
    } catch (error) {
      console.error("Disable 2FA error:", error);
      res.status(500).json({ message: "Erreur lors de la désactivation 2FA" });
    }
  });

  // Get current user
  app.get("/api/auth/user", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const sessionUser = (req.session as any).user;
      if (!sessionUser) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const user = await storage.getUser(sessionUser.id);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
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
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la déconnexion" });
      }
      res.json({ message: "Déconnexion réussie" });
    });
  });
}

// Middleware for authentication
export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    const user = await storage.getUser(sessionUser.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Utilisateur non valide" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Erreur d'authentification" });
  }
};

// Middleware for admin-only routes
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accès administrateur requis" });
  }
  next();
};

// Middleware for user role (can manage programs)
export const requireUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'user' && req.user.role !== 'admin')) {
    return res.status(403).json({ message: "Accès utilisateur requis" });
  }
  next();
};
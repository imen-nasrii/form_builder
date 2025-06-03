import nodemailer from 'nodemailer';
import crypto from 'crypto';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuration will be set via environment variables
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmailVerification(email: string, token: string, userName: string): Promise<boolean> {
    try {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@formbuilder.com',
        to: email,
        subject: 'Vérification de votre compte Form Builder',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1976d2;">Bienvenue sur Form Builder</h2>
            <p>Bonjour ${userName},</p>
            <p>Merci de vous être inscrit sur Form Builder. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
            <a href="${verificationUrl}" style="display: inline-block; background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Vérifier mon email
            </a>
            <p>Ce lien expire dans 24 heures.</p>
            <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">Form Builder - Générateur de formulaires</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erreur envoi email de vérification:', error);
      return false;
    }
  }

  async sendPasswordReset(email: string, token: string, userName: string): Promise<boolean> {
    try {
      const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@formbuilder.com',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1976d2;">Réinitialisation de mot de passe</h2>
            <p>Bonjour ${userName},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Réinitialiser mon mot de passe
            </a>
            <p>Ce lien expire dans 1 heure.</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">Form Builder - Générateur de formulaires</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erreur envoi email de réinitialisation:', error);
      return false;
    }
  }

  async send2FASetupEmail(email: string, userName: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@formbuilder.com',
        to: email,
        subject: 'Authentification à deux facteurs activée',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1976d2;">Authentification à deux facteurs</h2>
            <p>Bonjour ${userName},</p>
            <p>L'authentification à deux facteurs a été activée sur votre compte administrateur.</p>
            <p>Votre compte est maintenant plus sécurisé. Vous devrez utiliser votre application d'authentification pour vous connecter.</p>
            <p>Si vous n'avez pas activé cette fonctionnalité, contactez immédiatement l'administrateur système.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">Form Builder - Générateur de formulaires</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erreur envoi email 2FA:', error);
      return false;
    }
  }

  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

export const emailService = new EmailService();
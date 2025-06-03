import nodemailer from 'nodemailer';
import crypto from 'crypto';

interface EmailConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email service not configured - EMAIL_USER and EMAIL_PASS required');
      return;
    }

    const config: EmailConfig = {
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };

    // If custom SMTP settings are provided
    if (process.env.EMAIL_HOST) {
      config.host = process.env.EMAIL_HOST;
      config.port = parseInt(process.env.EMAIL_PORT || '587');
      config.secure = process.env.EMAIL_SECURE === 'true';
      delete config.service;
    }

    try {
      this.transporter = nodemailer.createTransport(config);
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email service not initialized');
      return false;
    }

    const verificationUrl = `${process.env.APP_URL || 'http://localhost:5000'}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Vérification de votre compte FormCraft Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">FormCraft Pro</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Vérifiez votre compte</h2>
            <p style="color: #666; line-height: 1.6;">
              Merci de vous être inscrit sur FormCraft Pro. Pour activer votre compte et commencer à créer des formulaires avancés, 
              veuillez cliquer sur le bouton ci-dessous :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold;
                        display: inline-block;">
                Vérifier mon compte
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
              <br>
              <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Ce lien expirera dans 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent to:', email);
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email service not initialized');
      return false;
    }

    const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Réinitialisation de votre mot de passe FormCraft Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">FormCraft Pro</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
            <p style="color: #666; line-height: 1.6;">
              Vous avez demandé la réinitialisation de votre mot de passe. 
              Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold;
                        display: inline-block;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
              <br>
              <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Ce lien expirera dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent to:', email);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  generatePasswordResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

export const emailService = new EmailService();
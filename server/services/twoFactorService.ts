import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
}

export class TwoFactorService {
  generateSecret(userEmail: string): TwoFactorSetup {
    const secret = speakeasy.generateSecret({
      name: userEmail,
      issuer: 'Form Builder',
      length: 32,
    });

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url!,
      manualEntryKey: secret.base32,
    };
  }

  async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      return await qrcode.toDataURL(otpauthUrl);
    } catch (error) {
      console.error('Erreur génération QR code:', error);
      throw new Error('Impossible de générer le QR code');
    }
  }

  verifyToken(token: string, secret: string, window: number = 1): boolean {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: window,
    });
  }

  generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }
}

export const twoFactorService = new TwoFactorService();
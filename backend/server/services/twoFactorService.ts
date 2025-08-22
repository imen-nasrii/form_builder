import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  manualEntryKey: string;
}

class TwoFactorService {
  /**
   * Generate a new 2FA secret and QR code for a user
   */
  async generateSecret(userEmail: string, serviceName: string = 'FormCraft Pro'): Promise<TwoFactorSetup> {
    // Generate a secret
    const secret = speakeasy.generateSecret({
      name: userEmail,
      issuer: serviceName,
      length: 32,
    });

    if (!secret.otpauth_url) {
      throw new Error('Failed to generate OTP auth URL');
    }

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCode,
      manualEntryKey: secret.base32,
    };
  }

  /**
   * Verify a TOTP token against a secret
   */
  verifyToken(token: string, secret: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow for time drift
    });
  }

  /**
   * Generate a backup code (for recovery)
   */
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric codes
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    
    return codes;
  }

  /**
   * Validate backup code format
   */
  isValidBackupCode(code: string): boolean {
    // 8 characters, alphanumeric
    return /^[A-Z0-9]{8}$/.test(code);
  }
}

export const twoFactorService = new TwoFactorService();
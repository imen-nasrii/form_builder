import nodemailer from 'nodemailer';

// Email service configuration
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Use configured email service
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Development mode - log emails to console
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }
};

export const emailService = {
  async sendVerificationEmail(email: string, token: string, firstName?: string) {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/verify-email/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@formbuilder.com',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">FormBuilder Pro</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">
              ${firstName ? `Hi ${firstName}` : 'Welcome'}!
            </h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for signing up! Please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 25px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${verificationUrl}" style="color: #007bff;">${verificationUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 14px; margin-top: 25px;">
              This verification link will expire in 24 hours.
            </p>
          </div>
          
          <div style="padding: 20px; text-align: center; background: #e9ecef; color: #666; font-size: 12px;">
            If you didn't create this account, you can safely ignore this email.
          </div>
        </div>
      `
    };

    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_SERVICE) {
      console.log('📧 Email would be sent to:', email);
      console.log('🔗 Verification URL:', verificationUrl);
      console.log('📄 Email content:', mailOptions.html);
    } else {
      await transporter.sendMail(mailOptions);
    }
  },

  async sendPasswordResetEmail(email: string, token: string, firstName?: string) {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@formbuilder.com',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">FormBuilder Pro</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">
              ${firstName ? `Hi ${firstName}` : 'Password Reset Request'}
            </h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 25px;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${resetUrl}" style="color: #dc3545;">${resetUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 14px; margin-top: 25px;">
              This reset link will expire in 1 hour for security reasons.
            </p>
          </div>
          
          <div style="padding: 20px; text-align: center; background: #e9ecef; color: #666; font-size: 12px;">
            If you didn't request this password reset, you can safely ignore this email.
          </div>
        </div>
      `
    };

    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_SERVICE) {
      console.log('📧 Password reset email would be sent to:', email);
      console.log('🔗 Reset URL:', resetUrl);
      console.log('📄 Email content:', mailOptions.html);
    } else {
      await transporter.sendMail(mailOptions);
    }
  }
};
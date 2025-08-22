import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { storage } from './storage';

async function createAdminUser() {
  try {
    const adminEmail = 'admin@formcraft.pro';
    const adminPassword = 'AdminPass123!';

    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail(adminEmail);
    if (existingAdmin) {
      console.log('Admin user already exists:', adminEmail);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = await storage.createUser({
      id: nanoid(),
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      profileImageUrl: null,
      role: 'admin',
      twoFactorEnabled: false,
      twoFactorSecret: null,
      emailVerified: true, // Admin accounts are pre-verified
      emailVerificationToken: null,
      isActive: true,
    });

    console.log('Admin user created successfully:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('User ID:', admin.id);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the function
createAdminUser();
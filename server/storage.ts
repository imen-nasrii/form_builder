import {
  users,
  forms,
  formTemplates,
  twoFactorTokens,
  emailVerificationTokens,
  passwordResetTokens,
  type User,
  type UpsertUser,
  type Form,
  type InsertForm,
  type FormTemplate,
  type InsertFormTemplate,
  type TwoFactorToken,
  type InsertTwoFactorToken,
  type EmailVerificationToken,
  type InsertEmailVerificationToken,
  type PasswordResetToken,
  type InsertPasswordResetToken,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: string, role: string): Promise<void>;
  enableTwoFactor(userId: string, secret: string): Promise<void>;
  disableTwoFactor(userId: string): Promise<void>;
  verifyUserEmail(userId: string): Promise<void>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  updateVerificationToken(userId: string, token: string): Promise<void>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  setPasswordResetToken(userId: string, token: string, expiry: Date): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  clearPasswordResetToken(userId: string): Promise<void>;
  
  // Form/Program operations
  getForms(userId: string): Promise<Form[]>;
  getForm(id: number): Promise<Form | undefined>;
  getFormByMenuId(menuId: string): Promise<Form | undefined>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(id: number, form: Partial<InsertForm>): Promise<Form>;
  deleteForm(id: number): Promise<void>;
  
  // Program operations (aliases for forms with additional functionality)
  getPrograms(userId: string): Promise<Form[]>;
  getAllPrograms(): Promise<Form[]>;
  getProgram(id: number): Promise<Form | undefined>;
  createProgram(program: InsertForm): Promise<Form>;
  updateProgram(id: number, program: Partial<InsertForm>): Promise<Form>;
  deleteProgram(id: number): Promise<void>;
  updateProgramStatus(id: number, status: string, assignedTo?: string): Promise<void>;
  
  // Template operations
  getTemplates(userId?: string): Promise<FormTemplate[]>;
  getTemplate(id: number): Promise<FormTemplate | undefined>;
  createTemplate(template: InsertFormTemplate): Promise<FormTemplate>;
  deleteTemplate(id: number): Promise<void>;
  
  // 2FA operations
  createTwoFactorToken(token: InsertTwoFactorToken): Promise<TwoFactorToken>;
  verifyTwoFactorToken(userId: string, token: string): Promise<boolean>;
  cleanupExpiredTokens(): Promise<void>;
  
  // Email verification operations
  createEmailVerificationToken(token: InsertEmailVerificationToken): Promise<EmailVerificationToken>;
  verifyEmailToken(token: string): Promise<string | null>;
  
  // Password reset operations
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  verifyPasswordResetToken(token: string): Promise<string | null>;
  markPasswordResetTokenUsed(token: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return allUsers;
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async enableTwoFactor(userId: string, secret: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        twoFactorEnabled: true, 
        twoFactorSecret: secret,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async disableTwoFactor(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        twoFactorEnabled: false,
        twoFactorSecret: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async verifyUserEmail(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        emailVerified: true,
        emailVerificationToken: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token));
    return user;
  }

  async updateVerificationToken(userId: string, token: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        emailVerificationToken: token,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.passwordResetToken, token));
    return user;
  }

  async setPasswordResetToken(userId: string, token: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        passwordResetToken: token,
        passwordResetTokenExpiry: expiry,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // Form operations
  async getForms(userId: string): Promise<Form[]> {
    return await db
      .select()
      .from(forms)
      .where(eq(forms.createdBy, userId))
      .orderBy(desc(forms.updatedAt));
  }

  async getForm(id: number): Promise<Form | undefined> {
    const [form] = await db.select().from(forms).where(eq(forms.id, id));
    return form;
  }

  async getFormByMenuId(menuId: string): Promise<Form | undefined> {
    const [form] = await db.select().from(forms).where(eq(forms.menuId, menuId));
    return form;
  }

  async createForm(form: InsertForm): Promise<Form> {
    const [newForm] = await db.insert(forms).values(form).returning();
    return newForm;
  }

  async updateForm(id: number, form: Partial<InsertForm>): Promise<Form> {
    const [updatedForm] = await db
      .update(forms)
      .set({ ...form, updatedAt: new Date() })
      .where(eq(forms.id, id))
      .returning();
    return updatedForm;
  }

  async deleteForm(id: number): Promise<void> {
    await db.delete(forms).where(eq(forms.id, id));
  }

  // Program operations (aliases for forms with additional functionality)
  async getPrograms(userId: string): Promise<Form[]> {
    return this.getForms(userId);
  }

  async getAllPrograms(): Promise<Form[]> {
    return await db
      .select()
      .from(forms)
      .orderBy(desc(forms.updatedAt));
  }

  async getProgram(id: number): Promise<Form | undefined> {
    return this.getForm(id);
  }

  async createProgram(program: InsertForm): Promise<Form> {
    return this.createForm(program);
  }

  async updateProgram(id: number, program: Partial<InsertForm>): Promise<Form> {
    return this.updateForm(id, program);
  }

  async deleteProgram(id: number): Promise<void> {
    return this.deleteForm(id);
  }

  async updateProgramStatus(id: number, status: string, assignedTo?: string): Promise<void> {
    const updateData: any = { 
      status,
      updatedAt: new Date()
    };
    
    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    await db
      .update(forms)
      .set(updateData)
      .where(eq(forms.id, id));
  }

  // Template operations
  async getTemplates(userId?: string): Promise<FormTemplate[]> {
    if (userId) {
      return await db
        .select()
        .from(formTemplates)
        .where(eq(formTemplates.createdBy, userId))
        .orderBy(desc(formTemplates.createdAt));
    }
    return await db
      .select()
      .from(formTemplates)
      .orderBy(desc(formTemplates.createdAt));
  }

  async getTemplate(id: number): Promise<FormTemplate | undefined> {
    const [template] = await db.select().from(formTemplates).where(eq(formTemplates.id, id));
    return template;
  }

  async createTemplate(template: InsertFormTemplate): Promise<FormTemplate> {
    const [newTemplate] = await db.insert(formTemplates).values(template).returning();
    return newTemplate;
  }

  async deleteTemplate(id: number): Promise<void> {
    await db.delete(formTemplates).where(eq(formTemplates.id, id));
  }

  // 2FA operations
  async createTwoFactorToken(token: InsertTwoFactorToken): Promise<TwoFactorToken> {
    const [newToken] = await db.insert(twoFactorTokens).values(token).returning();
    return newToken;
  }

  async verifyTwoFactorToken(userId: string, token: string): Promise<boolean> {
    const [tokenRecord] = await db
      .select()
      .from(twoFactorTokens)
      .where(eq(twoFactorTokens.userId, userId))
      .orderBy(desc(twoFactorTokens.createdAt))
      .limit(1);

    if (!tokenRecord || tokenRecord.token !== token) {
      return false;
    }

    if (new Date() > tokenRecord.expiresAt) {
      return false;
    }

    // Delete used token
    await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, tokenRecord.id));
    return true;
  }

  async cleanupExpiredTokens(): Promise<void> {
    await db.delete(twoFactorTokens).where(eq(twoFactorTokens.expiresAt, new Date()));
  }

  // Email verification operations
  async createEmailVerificationToken(token: InsertEmailVerificationToken): Promise<EmailVerificationToken> {
    const [newToken] = await db.insert(emailVerificationTokens).values(token).returning();
    return newToken;
  }

  async verifyEmailToken(token: string): Promise<string | null> {
    const [tokenRecord] = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token));

    if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
      return null;
    }

    // Delete used token
    await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, tokenRecord.id));
    return tokenRecord.userId;
  }

  // Password reset operations
  async createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [newToken] = await db.insert(passwordResetTokens).values(token).returning();
    return newToken;
  }

  async verifyPasswordResetToken(token: string): Promise<string | null> {
    const [tokenRecord] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    if (!tokenRecord || tokenRecord.used || new Date() > tokenRecord.expiresAt) {
      return null;
    }

    return tokenRecord.userId;
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.token, token));
  }
}

export const storage = new DatabaseStorage();

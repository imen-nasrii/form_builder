import {
  users,
  forms,
  formTemplates,
  twoFactorTokens,
  emailVerificationTokens,
  passwordResetTokens,
  notifications,
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
  type Notification,
  type InsertNotification,
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
  
  // Form operations
  getForms(userId: string): Promise<Form[]>;
  getForm(id: number): Promise<Form | undefined>;
  getFormByMenuId(menuId: string): Promise<Form | undefined>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(id: number, form: Partial<InsertForm>): Promise<Form>;
  deleteForm(id: number): Promise<void>;
  
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

  // Form operations
  async getForms(userId: string): Promise<Form[]> {
    return await db
      .select()
      .from(forms)
      .where(eq(forms.createdBy, userId))
      .orderBy(desc(forms.updatedAt));
  }

  async getAllForms(): Promise<Form[]> {
    return await db
      .select()
      .from(forms)
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

  // Admin operations
  async deleteUser(userId: string): Promise<void> {
    // Delete user's forms first
    await db.delete(forms).where(eq(forms.createdBy, userId));
    // Delete the user
    await db.delete(users).where(eq(users.id, userId));
  }

  async assignFormToUser(formId: number, userId: string): Promise<void> {
    await db.update(forms)
      .set({ 
        assignedTo: userId,
        status: 'todo',
        updatedAt: new Date()
      })
      .where(eq(forms.id, formId));
  }

  // Notification operations
  async createNotification(notification: { userId: string; programId: number; programLabel: string; message: string; type: string }): Promise<Notification> {
    console.log('Creating notification:', notification);
    const notificationData = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: notification.userId,
      programId: notification.programId.toString(),
      programLabel: notification.programLabel,
      message: notification.message,
      type: notification.type,
      read: false
    };
    const [newNotification] = await db.insert(notifications).values(notificationData).returning();
    return newNotification;
  }

  async getNotifications(userId?: string): Promise<Notification[]> {
    if (userId) {
      return await db.select().from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt));
    }
    return await db.select().from(notifications)
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notificationId));
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

  // Notification operations
  async getAllNotifications(): Promise<any[]> {
    try {
      const { notifications } = await import("@shared/schema");
      const allNotifications = await db.select().from(notifications).orderBy(notifications.createdAt);
      return allNotifications;
    } catch (error) {
      console.error("Error getting all notifications:", error);
      return [];
    }
  }

  async getUserNotifications(userId: string): Promise<any[]> {
    try {
      const { notifications } = await import("@shared/schema");
      const userNotifications = await db.select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(notifications.createdAt);
      return userNotifications;
    } catch (error) {
      console.error("Error getting user notifications:", error);
      return [];
    }
  }

  async createNotification(notificationData: any): Promise<any> {
    try {
      const { notifications } = await import("@shared/schema");
      const [notification] = await db
        .insert(notifications)
        .values({
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: notificationData.userId,
          programId: notificationData.programId?.toString() || null,
          programLabel: notificationData.programLabel || 'Unknown Program',
          type: notificationData.type || 'assignment',
          message: notificationData.message,
          read: false,
          createdAt: new Date()
        })
        .returning();
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const { notifications } = await import("@shared/schema");
      await db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.id, notificationId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // First, delete or reassign forms created by this user
      await db.delete(forms).where(eq(forms.createdBy, userId));
      
      // Delete notifications for this user
      const { notifications } = await import("@shared/schema");
      await db.delete(notifications).where(eq(notifications.userId, userId));
      
      // Finally, delete the user
      await db.delete(users).where(eq(users.id, userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();

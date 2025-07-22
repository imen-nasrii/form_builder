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
  externalComponents,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: string, role: string): Promise<void>;
  updateUserProfile(userId: string, profileData: { firstName?: string; lastName?: string; profileImageUrl?: string; }): Promise<User>;
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

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

  async updateUserProfile(userId: string, profileData: { firstName?: string; lastName?: string; profileImageUrl?: string; }): Promise<User> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({ 
          ...profileData,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))
        .returning();
      
      return updatedUser;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      throw error;
    }
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


  async getUserNotifications(userId: string, limit: number = 50, offset: number = 0): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getAllNotifications(): Promise<Notification[]> {
    return await db.select().from(notifications)
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
    return result[0]?.count || 0;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications)
      .set({ read: true, readAt: new Date() })
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
  }

  async markNotificationAsRead(notificationId: number, userId: string): Promise<boolean> {
    const [updated] = await db
      .update(notifications)
      .set({ read: true, readAt: new Date() })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
      .returning();
    return !!updated;
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async createBulkNotifications(notificationsData: InsertNotification[]): Promise<Notification[]> {
    return await db
      .insert(notifications)
      .values(notificationsData)
      .returning();
  }

  // Form status update operations
  async updateFormStatus(formId: number, updates: { status?: string; priority?: string; comment?: string }): Promise<void> {
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (updates.status) updateData.status = updates.status;
    if (updates.priority) updateData.priority = updates.priority;
    if (updates.comment) {
      // For now, we'll just log comments since we don't have a comments table
      console.log(`Comment for form ${formId}: ${updates.comment}`);
    }
    
    await db.update(forms)
      .set(updateData)
      .where(eq(forms.id, formId));
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

  async getUserNotifications(userId: string, limit: number = 50, offset: number = 0): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async createBulkNotifications(notificationList: InsertNotification[]): Promise<Notification[]> {
    if (notificationList.length === 0) return [];
    
    const newNotifications = await db
      .insert(notifications)
      .values(notificationList)
      .returning();
    return newNotifications;
  }



  async deleteUser(userId: string): Promise<void> {
    try {
      // First, delete or reassign forms created by this user
      await db.delete(forms).where(eq(forms.createdBy, userId));
      
      // Delete notifications for this user
      await db.delete(notifications).where(eq(notifications.userId, userId));
      
      // Finally, delete the user
      await db.delete(users).where(eq(users.id, userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async getUserStatistics(userId: string) {
    try {
      // Get all forms for the user (created by or assigned to)
      const myCreatedForms = await db.select().from(forms).where(eq(forms.createdBy, userId));
      const myAssignedForms = await db.select().from(forms).where(eq(forms.assignedTo, userId));
      
      // Combine and deduplicate
      const allMyForms = [...myCreatedForms];
      myAssignedForms.forEach(form => {
        if (!allMyForms.find(f => f.id === form.id)) {
          allMyForms.push(form);
        }
      });

      // Calculate statistics
      const totalPrograms = myCreatedForms.length;
      const assignedTasks = myAssignedForms.length;
      const completedTasks = myAssignedForms.filter(f => f.status === 'completed').length;
      
      // Recent activity (forms updated in last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentActivity = allMyForms.filter(f => 
        f.updatedAt && new Date(f.updatedAt) > weekAgo
      ).length;

      // Program types breakdown
      const programTypes = {
        process: allMyForms.filter(f => f.layout === 'PROCESS').length,
        masterMenu: allMyForms.filter(f => f.layout === 'MASTER_MENU' || f.layout === 'MASTERMENU').length,
        transaction: allMyForms.filter(f => f.layout === 'TRANSACTION').length,
        other: allMyForms.filter(f => !['PROCESS', 'MASTER_MENU', 'MASTERMENU', 'TRANSACTION'].includes(f.layout)).length,
      };

      // Status breakdown for assigned tasks
      const statusBreakdown = {
        todo: myAssignedForms.filter(f => f.status === 'todo').length,
        inProgress: myAssignedForms.filter(f => f.status === 'in_progress').length,
        review: myAssignedForms.filter(f => f.status === 'review').length,
        completed: completedTasks,
      };

      // Priority breakdown for assigned tasks
      const priorityBreakdown = {
        low: myAssignedForms.filter(f => f.priority === 'low').length,
        medium: myAssignedForms.filter(f => f.priority === 'medium').length,
        high: myAssignedForms.filter(f => f.priority === 'high').length,
      };

      // Monthly activity for the last 6 months
      const monthlyActivity = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthForms = allMyForms.filter(f => {
          const createdAt = new Date(f.createdAt);
          return createdAt >= monthStart && createdAt <= monthEnd;
        });

        const monthAssigned = myAssignedForms.filter(f => {
          const createdAt = new Date(f.createdAt);
          return createdAt >= monthStart && createdAt <= monthEnd;
        });

        const monthCompleted = myAssignedForms.filter(f => {
          const updatedAt = new Date(f.updatedAt || f.createdAt);
          return f.status === 'completed' && updatedAt >= monthStart && updatedAt <= monthEnd;
        });

        monthlyActivity.push({
          month: date.toLocaleDateString('en', { month: 'short' }),
          created: monthForms.length,
          assigned: monthAssigned.length,
          completed: monthCompleted.length,
        });
      }

      return {
        totalPrograms,
        assignedTasks,
        completedTasks,
        recentActivity,
        programTypes,
        statusBreakdown,
        priorityBreakdown,
        monthlyActivity,
        allMyForms: allMyForms.length,
      };
    } catch (error) {
      console.error('Error getting user statistics:', error);
      throw error;
    }
  }

  async getAdminStatistics() {
    try {
      // Get all users
      const allUsers = await db.select().from(users);
      const allForms = await db.select().from(forms);
      const allNotifications = await db.select().from(notifications);

      // Calculate user statistics
      const totalUsers = allUsers.length;
      const adminUsers = allUsers.filter(u => u.role === 'admin').length;
      const regularUsers = allUsers.filter(u => u.role === 'user').length;
      const verifiedUsers = allUsers.filter(u => u.emailVerified).length;
      const users2FA = allUsers.filter(u => u.twoFactorEnabled).length;

      // Calculate program statistics
      const totalPrograms = allForms.length;
      const assignedPrograms = allForms.filter(f => f.assignedTo).length;
      const completedPrograms = allForms.filter(f => f.status === 'completed').length;
      const inProgressPrograms = allForms.filter(f => f.status === 'in_progress').length;

      // Calculate notification statistics
      const totalNotifications = allNotifications.length;
      const unreadNotifications = allNotifications.filter(n => !n.read).length;

      // Recent activity (last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentUsers = allUsers.filter(u => new Date(u.createdAt) > weekAgo).length;
      const recentPrograms = allForms.filter(f => new Date(f.createdAt) > weekAgo).length;
      const recentNotifications = allNotifications.filter(n => new Date(n.createdAt) > weekAgo).length;

      // Program type breakdown
      const programTypes = {
        process: allForms.filter(f => f.layout === 'PROCESS').length,
        masterMenu: allForms.filter(f => f.layout === 'MASTER_MENU' || f.layout === 'MASTERMENU').length,
        transaction: allForms.filter(f => f.layout === 'TRANSACTION').length,
        other: allForms.filter(f => !['PROCESS', 'MASTER_MENU', 'MASTERMENU', 'TRANSACTION'].includes(f.layout)).length,
      };

      // User activity by creation date (last 6 months)
      const monthlyStats = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthUsers = allUsers.filter(u => {
          const createdAt = new Date(u.createdAt);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length;

        const monthPrograms = allForms.filter(f => {
          const createdAt = new Date(f.createdAt);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length;

        monthlyStats.push({
          month: date.toLocaleDateString('en', { month: 'short' }),
          users: monthUsers,
          programs: monthPrograms,
        });
      }

      return {
        users: {
          total: totalUsers,
          admins: adminUsers,
          regular: regularUsers,
          verified: verifiedUsers,
          with2FA: users2FA,
          recent: recentUsers,
        },
        programs: {
          total: totalPrograms,
          assigned: assignedPrograms,
          completed: completedPrograms,
          inProgress: inProgressPrograms,
          recent: recentPrograms,
          types: programTypes,
        },
        notifications: {
          total: totalNotifications,
          unread: unreadNotifications,
          recent: recentNotifications,
        },
        monthlyStats,
        recentActivity: {
          users: recentUsers,
          programs: recentPrograms,
          notifications: recentNotifications,
        },
      };
    } catch (error) {
      console.error('Error getting admin statistics:', error);
      throw error;
    }
  }
  // External components operations
  async getExternalComponents(): Promise<any[]> {
    try {
      return await db.select().from(externalComponents).where(eq(externalComponents.isActive, true));
    } catch (error) {
      console.log("External components table not available yet");
      return [];
    }
  }

  async createExternalComponent(component: any): Promise<any> {
    try {
      const [created] = await db
        .insert(externalComponents)
        .values(component)
        .returning();
      return created;
    } catch (error) {
      console.log("External components table not available yet");
      throw error;
    }
  }

  async deleteExternalComponent(id: string): Promise<void> {
    try {
      await db
        .update(externalComponents)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(externalComponents.id, id));
    } catch (error) {
      console.log("External components table not available yet");
    }
  }

  // Import/Export operations
  async exportPrograms(programIds: string[]): Promise<any[]> {
    if (programIds.length === 0) {
      return await db.select().from(forms);
    }
    
    const programs = await db.select().from(forms).where(
      sql`${forms.id}::text = ANY(${programIds})`
    );
    return programs;
  }

  async importPrograms(programsData: any[]): Promise<{ imported: number; skipped: number; errors: string[] }> {
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const programData of programsData) {
      try {
        // Check if program exists
        const existing = await db.select().from(forms).where(eq(forms.menuId, programData.menuId)).limit(1);
        
        if (existing.length > 0) {
          // Update existing
          await db
            .update(forms)
            .set({
              label: programData.label,
              fields: programData.fields,
              validations: programData.validations,
              updatedAt: new Date(),
            })
            .where(eq(forms.menuId, programData.menuId));
          imported++;
        } else {
          // Create new
          await db.insert(forms).values({
            id: Math.floor(Math.random() * 1000000),
            menuId: programData.menuId,
            label: programData.label,
            fields: programData.fields,
            validations: programData.validations || [],
            createdBy: programData.createdBy || 'import-system',
            assignedTo: programData.assignedTo,
          });
          imported++;
        }
      } catch (error) {
        errors.push(`Error importing ${programData.menuId}: ${error.message}`);
        skipped++;
      }
    }

    return { imported, skipped, errors };
  }
}

export const storage = new DatabaseStorage();

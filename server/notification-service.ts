import { storage } from './storage';
import type { InsertNotification, User } from '@shared/schema';

export class NotificationService {
  // Create notification for program assignment
  async notifyProgramAssignment(
    assignedUserId: string,
    assignedByUserId: string,
    programId: number,
    programLabel: string
  ) {
    const assignedByUser = await storage.getUser(assignedByUserId);
    const assignerName = assignedByUser ? 
      `${assignedByUser.firstName || ''} ${assignedByUser.lastName || ''}`.trim() || assignedByUser.email :
      'Administrator';

    const notification: InsertNotification = {
      userId: assignedUserId,
      title: 'New Program Assigned',
      message: `You have been assigned to program "${programLabel}" by ${assignerName}`,
      type: 'assignment',
      relatedFormId: programId,
      actionBy: assignedByUserId,
      priority: 'high',
    };

    await storage.createNotification(notification);

    // Also notify admin users about the assignment
    const adminUsers = await storage.getAllUsers();
    const adminNotifications = adminUsers
      .filter(user => user.role === 'admin' && user.id !== assignedByUserId)
      .map(admin => ({
        userId: admin.id,
        title: 'Program Assignment Made',
        message: `Program "${programLabel}" has been assigned to a user by ${assignerName}`,
        type: 'assignment',
        relatedFormId: programId,
        actionBy: assignedByUserId,
        priority: 'medium',
      } as InsertNotification));

    if (adminNotifications.length > 0) {
      await storage.createBulkNotifications(adminNotifications);
    }
  }

  // Create notification for task acceptance
  async notifyTaskAcceptance(
    userId: string,
    programId: number,
    programLabel: string
  ) {
    const user = await storage.getUser(userId);
    const userName = user ? 
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email :
      'User';

    // Notify all admin users about task acceptance
    const adminUsers = await storage.getAllUsers();
    const adminNotifications = adminUsers
      .filter(user => user.role === 'admin')
      .map(admin => ({
        userId: admin.id,
        title: 'Task Accepted',
        message: `${userName} has accepted and started working on "${programLabel}"`,
        type: 'task_accepted',
        relatedFormId: programId,
        actionBy: userId,
        priority: 'medium',
      } as InsertNotification));

    if (adminNotifications.length > 0) {
      await storage.createBulkNotifications(adminNotifications);
    }
  }

  // Create notification for task status changes (alias for compatibility)
  async notifyTaskStatusChange(
    assignedUserId: string,
    createdByUserId: string,
    programId: number,
    programLabel: string,
    newStatus: string
  ) {
    // Use the existing notifyStatusChange method
    await this.notifyStatusChange(assignedUserId, programId, programLabel, '', newStatus);
  }

  // Create notification for status changes
  async notifyStatusChange(
    userId: string,
    programId: number,
    programLabel: string,
    oldStatus: string,
    newStatus: string
  ) {
    const user = await storage.getUser(userId);
    const userName = user ? 
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email :
      'User';

    const statusMessages = {
      'todo': 'moved to To Do',
      'in_progress': 'started working on',
      'review': 'submitted for review',
      'completed': 'completed'
    };

    const statusMessage = statusMessages[newStatus as keyof typeof statusMessages] || `changed status to ${newStatus}`;
    const priority = newStatus === 'review' || newStatus === 'completed' ? 'high' : 'medium';

    // Notify all admin users about status changes
    const adminUsers = await storage.getAllUsers();
    const adminNotifications = adminUsers
      .filter(user => user.role === 'admin')
      .map(admin => ({
        userId: admin.id,
        title: 'Task Status Updated',
        message: `${userName} has ${statusMessage} "${programLabel}"`,
        type: 'status_change',
        relatedFormId: programId,
        actionBy: userId,
        priority,
      } as InsertNotification));

    if (adminNotifications.length > 0) {
      await storage.createBulkNotifications(adminNotifications);
    }

    // Special notifications for review and completion
    if (newStatus === 'review') {
      await this.notifyTaskSubmittedForReview(userId, programId, programLabel);
    }

    if (newStatus === 'completed') {
      await this.notifyTaskCompleted(userId, programId, programLabel);
    }
  }

  // Create notification for task submission for review
  async notifyTaskSubmittedForReview(
    userId: string,
    programId: number,
    programLabel: string
  ) {
    const user = await storage.getUser(userId);
    const userName = user ? 
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email :
      'User';

    // Notify all admin users about submission for review
    const adminUsers = await storage.getAllUsers();
    const adminNotifications = adminUsers
      .filter(user => user.role === 'admin')
      .map(admin => ({
        userId: admin.id,
        title: 'Task Requires Review',
        message: `${userName} has submitted "${programLabel}" for review and approval`,
        type: 'task_submitted',
        relatedFormId: programId,
        actionBy: userId,
        priority: 'high',
      } as InsertNotification));

    if (adminNotifications.length > 0) {
      await storage.createBulkNotifications(adminNotifications);
    }
  }

  // Create notification for task completion
  async notifyTaskCompleted(
    userId: string,
    programId: number,
    programLabel: string
  ) {
    const user = await storage.getUser(userId);
    const userName = user ? 
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email :
      'User';

    // Notify all admin users about task completion
    const adminUsers = await storage.getAllUsers();
    const adminNotifications = adminUsers
      .filter(user => user.role === 'admin')
      .map(admin => ({
        userId: admin.id,
        title: 'Task Completed',
        message: `${userName} has successfully completed "${programLabel}"`,
        type: 'task_completed',
        relatedFormId: programId,
        actionBy: userId,
        priority: 'high',
      } as InsertNotification));

    if (adminNotifications.length > 0) {
      await storage.createBulkNotifications(adminNotifications);
    }
  }

  // Create notification for comments added
  async notifyCommentAdded(
    userId: string,
    programId: number,
    programLabel: string,
    comment: string
  ) {
    const user = await storage.getUser(userId);
    const userName = user ? 
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email :
      'User';

    // Notify all admin users about comments
    const adminUsers = await storage.getAllUsers();
    const adminNotifications = adminUsers
      .filter(user => user.role === 'admin')
      .map(admin => ({
        userId: admin.id,
        title: 'Comment Added',
        message: `${userName} added a comment to "${programLabel}": ${comment.substring(0, 100)}${comment.length > 100 ? '...' : ''}`,
        type: 'comment_added',
        relatedFormId: programId,
        actionBy: userId,
        priority: 'low',
      } as InsertNotification));

    if (adminNotifications.length > 0) {
      await storage.createBulkNotifications(adminNotifications);
    }
  }

  // Create notification for admin assignment actions
  async notifyAdminAction(
    adminUserId: string,
    targetUserId: string,
    action: string,
    programLabel?: string,
    programId?: number
  ) {
    const admin = await storage.getUser(adminUserId);
    const adminName = admin ? 
      `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.email :
      'Administrator';

    const notification: InsertNotification = {
      userId: targetUserId,
      title: 'Admin Action',
      message: `${adminName} has ${action}${programLabel ? ` for "${programLabel}"` : ''}`,
      type: 'admin_action',
      relatedFormId: programId,
      actionBy: adminUserId,
      priority: 'medium',
    };

    await storage.createNotification(notification);
  }

  // Create system-wide announcements
  async notifySystemAnnouncement(
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ) {
    const allUsers = await storage.getAllUsers();
    const announcements = allUsers.map(user => ({
      userId: user.id,
      title,
      message,
      type: 'announcement',
      priority,
    } as InsertNotification));

    if (announcements.length > 0) {
      await storage.createBulkNotifications(announcements);
    }
  }

  // Create notification for deadline reminders
  async notifyDeadlineReminder(
    userId: string,
    programId: number,
    programLabel: string,
    daysUntilDeadline: number
  ) {
    const urgencyLevel = daysUntilDeadline <= 1 ? 'urgent' : daysUntilDeadline <= 3 ? 'high' : 'medium';
    const timeText = daysUntilDeadline === 1 ? 'tomorrow' : 
                     daysUntilDeadline === 0 ? 'today' : 
                     `in ${daysUntilDeadline} days`;

    const notification: InsertNotification = {
      userId,
      title: 'Deadline Reminder',
      message: `Program "${programLabel}" is due ${timeText}. Please ensure completion on time.`,
      type: 'deadline_reminder',
      relatedFormId: programId,
      priority: urgencyLevel,
    };

    await storage.createNotification(notification);
  }
}

export const notificationService = new NotificationService();
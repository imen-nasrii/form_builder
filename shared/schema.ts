import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("user"), // "user" or "admin"
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  twoFactorSecret: varchar("two_factor_secret"),
  emailVerified: boolean("email_verified").notNull().default(false),
  emailVerificationToken: varchar("email_verification_token"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Form definitions table
export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  menuId: varchar("menu_id").notNull().unique(),
  label: varchar("label").notNull(),
  formWidth: varchar("form_width").notNull().default("700px"),
  layout: varchar("layout").notNull().default("PROCESS"),
  fields: jsonb("fields").notNull().default("[]"),
  actions: jsonb("actions").notNull().default("[]"),
  validations: jsonb("validations").notNull().default("[]"),
  formDefinition: text("form_definition"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Form templates table
export const formTemplates = pgTable("form_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  templateData: jsonb("template_data").notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User sessions and 2FA tokens
export const twoFactorTokens = pgTable("two_factor_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  token: varchar("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email verification tokens table
export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Notifications table for program assignments and updates
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'assignment', 'task_accepted', 'task_completed', 'status_change', 'comment_added'
  relatedFormId: integer("related_form_id"),
  actionBy: varchar("action_by"), // User ID who performed the action
  read: boolean("read").default(false),
  priority: varchar("priority", { length: 20 }).default("medium"), // 'low', 'medium', 'high', 'urgent'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export type InsertForm = typeof forms.$inferInsert;
export type Form = typeof forms.$inferSelect;

export type InsertFormTemplate = typeof formTemplates.$inferInsert;
export type FormTemplate = typeof formTemplates.$inferSelect;

export type InsertTwoFactorToken = typeof twoFactorTokens.$inferInsert;
export type TwoFactorToken = typeof twoFactorTokens.$inferSelect;

export type InsertEmailVerificationToken = typeof emailVerificationTokens.$inferInsert;
export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;

export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

// Form field types and validation schemas
export const insertFormSchema = createInsertSchema(forms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTemplateSchema = createInsertSchema(formTemplates).omit({
  id: true,
  createdAt: true,
});

// Validation operators enum
export const ValidationOperators = {
  EQ: "EQUAL",
  NEQ: "NEQUAL", 
  CT: "CONTAIN",
  NCT: "NCONTAIN",
  SW: "STARTWITH",
  EW: "ENDWITH",
  IN: "IN",
  NIN: "NIN",
  GT: "GT",
  GTE: "GTE", 
  LT: "LT",
  LTE: "LTE",
  ISN: "ISN",
  ISNN: "ISNN",
  CHANGED: "CHANGED",
  BETWEEN: "BETWEEN",
  IST: "IST",
  ISF: "ISF"
} as const;

// Field types enum
export const FieldTypes = {
  STRING: "STRING",
  DATE: "DATE", 
  NUMERIC: "NUMERIC",
  INTEGER: "INTEGER",
  BOOL: "BOOL",
  NOTSET: "NOTSET",
  ANY: "ANY",
  DICTONARY: "DICTONARY",
  LIST_RECORD: "LIST_RECORD",
  SINGLE_RECORD: "SINGLE_RECORD",
  LIST_STRING: "LIST_STRING",
  FILTER_TYPE: "FILTER_TYPE",
  SORT_TYPE: "SORT_TYPE",
  PAGINATION_TYPE: "PAGINATION_TYPE"
} as const;

// Component types enum
export const ComponentTypes = {
  GRID: "GRID",
  DIALOG: "DIALOG", 
  TEXT: "TEXT",
  GRIDLKP: "GRIDLKP",
  LSTLKP: "LSTLKP", 
  SELECT: "SELECT",
  DATEPICKER: "DATEPICKER",
  GROUP: "GROUP",
  CHECKBOX: "CHECKBOX", 
  ACTION: "ACTION",
  TEXTAREA: "TEXTAREA",
  FILEUPLOAD: "FILEUPLOAD",
  RADIOGRP: "RADIOGRP"
} as const;

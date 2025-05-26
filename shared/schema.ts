import {
  mysqlTable,
  text,
  varchar,
  timestamp,
  json,
  index,
  int,
  boolean,
  serial,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = mysqlTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => ({
    expireIdx: index("IDX_session_expire").on(table.expire),
  }),
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  role: varchar("role", { length: 50 }).notNull().default("user"), // "user" or "admin"
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  twoFactorSecret: varchar("two_factor_secret", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Form definitions table
export const forms = mysqlTable("forms", {
  id: serial("id").primaryKey(),
  menuId: varchar("menu_id", { length: 255 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(),
  formWidth: varchar("form_width", { length: 100 }).notNull().default("700px"),
  layout: varchar("layout", { length: 100 }).notNull().default("PROCESS"),
  fields: json("fields").notNull().default("[]"),
  actions: json("actions").notNull().default("[]"),
  validations: json("validations").notNull().default("[]"),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Form templates table
export const formTemplates = mysqlTable("form_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  templateData: json("template_data").notNull(),
  isPublic: boolean("is_public").notNull().default(false),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User sessions and 2FA tokens
export const twoFactorTokens = mysqlTable("two_factor_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertForm = typeof forms.$inferInsert;
export type Form = typeof forms.$inferSelect;

export type InsertFormTemplate = typeof formTemplates.$inferInsert;
export type FormTemplate = typeof formTemplates.$inferSelect;

export type InsertTwoFactorToken = typeof twoFactorTokens.$inferInsert;
export type TwoFactorToken = typeof twoFactorTokens.$inferSelect;

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

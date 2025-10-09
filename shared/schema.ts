import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - for assessment participants
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

// Login schema for authentication
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Assessments table
export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Responses stored as JSON: {q1: 3, q2: 4, ...}
  responses: json("responses").$type<Record<string, number>>().notNull().default(sql`'{}'::json`),
  
  // Calculated scores
  strategicIdentity: integer("strategic_identity").default(0),
  visibilityPositioning: integer("visibility_positioning").default(0),
  politicalCapital: integer("political_capital").default(0),
  totalScore: integer("total_score").default(0),
  zone: text("zone"),
  
  // Top priorities
  priority1: text("priority_1"),
  priority2: text("priority_2"),
  
  // Report generation
  reportGenerated: boolean("report_generated").notNull().default(false),
  reportApproved: boolean("report_approved").notNull().default(false),
  reportSentAt: timestamp("report_sent_at"),
  pdfUrl: text("pdf_url"),
  
  // MailerLite sync
  mailerLiteSynced: boolean("mailerlite_synced").notNull().default(false),
  mailerLiteSubId: text("mailerlite_sub_id"),
  
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  strategicIdentity: true,
  visibilityPositioning: true,
  politicalCapital: true,
  totalScore: true,
  zone: true,
  priority1: true,
  priority2: true,
  reportGenerated: true,
  reportApproved: true,
  reportSentAt: true,
  pdfUrl: true,
  mailerLiteSynced: true,
  mailerLiteSubId: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

// Admin table
export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
  role: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

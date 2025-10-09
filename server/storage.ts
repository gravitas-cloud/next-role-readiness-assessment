// Referenced from blueprint:javascript_database
import { users, assessments, admins, type User, type InsertUser, type Assessment, type InsertAssessment, type Admin, type InsertAdmin } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Assessment methods
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessment(id: string): Promise<Assessment | undefined>;
  updateAssessmentResponses(id: string, responses: Record<string, number>): Promise<Assessment>;
  completeAssessment(id: string, scores: { strategicIdentity: number; visibilityPositioning: number; politicalCapital: number; totalScore: number; zone: string; priority1: string; priority2: string }): Promise<Assessment>;
  getUserAssessments(userId: string): Promise<Assessment[]>;
  
  // Admin methods
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  getPendingAssessments(): Promise<Assessment[]>;
  approveAssessment(id: string): Promise<Assessment>;
  
  // PDF generation
  updatePdfUrl(id: string, pdfUrl: string): Promise<Assessment>;
  
  // MailerLite sync
  updateMailerLiteSync(id: string, subscriberId: string): Promise<Assessment>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ pool, createTableIfMissing: true });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const [assessment] = await db
      .insert(assessments)
      .values(insertAssessment)
      .returning();
    return assessment;
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment || undefined;
  }

  async updateAssessmentResponses(id: string, responses: Record<string, number>): Promise<Assessment> {
    const [assessment] = await db
      .update(assessments)
      .set({ responses })
      .where(eq(assessments.id, id))
      .returning();
    return assessment;
  }

  async completeAssessment(id: string, scores: { strategicIdentity: number; visibilityPositioning: number; politicalCapital: number; totalScore: number; zone: string; priority1: string; priority2: string }): Promise<Assessment> {
    const [assessment] = await db
      .update(assessments)
      .set({ 
        ...scores, 
        completedAt: new Date() 
      })
      .where(eq(assessments.id, id))
      .returning();
    return assessment;
  }

  async getUserAssessments(userId: string): Promise<Assessment[]> {
    return await db.select().from(assessments).where(eq(assessments.userId, userId));
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin || undefined;
  }

  async getPendingAssessments(): Promise<Assessment[]> {
    return await db.select().from(assessments).where(eq(assessments.reportApproved, false));
  }

  async approveAssessment(id: string): Promise<Assessment> {
    const [assessment] = await db
      .update(assessments)
      .set({ reportApproved: true })
      .where(eq(assessments.id, id))
      .returning();
    return assessment;
  }

  async updatePdfUrl(id: string, pdfUrl: string): Promise<Assessment> {
    const [assessment] = await db
      .update(assessments)
      .set({ 
        pdfUrl,
        reportGenerated: true 
      })
      .where(eq(assessments.id, id))
      .returning();
    return assessment;
  }

  async updateMailerLiteSync(id: string, subscriberId: string): Promise<Assessment> {
    const [assessment] = await db
      .update(assessments)
      .set({
        mailerLiteSynced: true,
        mailerLiteSubId: subscriberId,
        reportSentAt: new Date()
      })
      .where(eq(assessments.id, id))
      .returning();
    return assessment;
  }
}

export const storage = new DatabaseStorage();

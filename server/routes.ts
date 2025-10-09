import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, authenticateToken } from "./auth";
import { 
  calculateAssessmentScore, 
  getZoneInterpretation, 
  getPriorityDefinition,
  getAssessmentQuestions,
  getCTAContent,
  type AssessmentResponses 
} from "./scoring";
import { generatePDFReport } from "./pdf-generator";
import { z } from "zod";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Assessment routes
  
  // Get assessment questions and content (public endpoint for easy testing)
  app.get("/api/assessment/questions", (req, res) => {
    try {
      const content = getAssessmentQuestions();
      res.json(content);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });
  
  // Create new assessment (authenticated)
  app.post("/api/assessments", authenticateToken, async (req, res) => {
    try {
      const assessment = await storage.createAssessment({
        userId: req.user!.id,
        responses: {},
      });
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  // Get user's assessments (authenticated)
  app.get("/api/assessments", authenticateToken, async (req, res) => {
    try {
      const assessments = await storage.getUserAssessments(req.user!.id);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  // Get specific assessment (authenticated)
  app.get("/api/assessments/:id", authenticateToken, async (req, res) => {
    try {
      const assessment = await storage.getAssessment(req.params.id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Ensure user owns this assessment
      if (assessment.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(assessment);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  // Submit assessment responses (authenticated)
  app.post("/api/assessments/:id/submit", authenticateToken, async (req, res) => {
    try {
      const responseSchema = z.object({
        q1: z.number().min(1).max(5),
        q2: z.number().min(1).max(5),
        q3: z.number().min(1).max(5),
        q4: z.number().min(1).max(5),
        q5: z.number().min(1).max(5),
        q6: z.number().min(1).max(5),
        q7: z.number().min(1).max(5),
        q8: z.number().min(1).max(5),
        q9: z.number().min(1).max(5),
        q10: z.number().min(1).max(5),
        q11: z.number().min(1).max(5),
        q12: z.number().min(1).max(5),
      });

      const responses = responseSchema.parse(req.body);
      
      const assessment = await storage.getAssessment(req.params.id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Ensure user owns this assessment
      if (assessment.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Calculate scores using content library
      const scores = calculateAssessmentScore(responses as AssessmentResponses);

      // Update assessment with responses and scores
      await storage.updateAssessmentResponses(req.params.id, responses as unknown as Record<string, number>);
      const completedAssessment = await storage.completeAssessment(req.params.id, {
        strategicIdentity: scores.strategicIdentity,
        visibilityPositioning: scores.visibilityPositioning,
        politicalCapital: scores.politicalCapital,
        totalScore: scores.totalScore,
        zone: scores.zone,
        priority1: scores.priority1,
        priority2: scores.priority2,
      });

      res.json(completedAssessment);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to submit assessment" });
    }
  });

  // Get assessment results with zone interpretation and CTA content (authenticated)
  app.get("/api/assessments/:id/results", authenticateToken, async (req, res) => {
    try {
      const assessment = await storage.getAssessment(req.params.id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Ensure user owns this assessment
      if (assessment.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get zone interpretation from content library
      const zoneData = getZoneInterpretation(assessment.zone || "ZONE_1");
      
      // Get priority definitions
      const priority1Data = getPriorityDefinition(assessment.priority1 || "");
      const priority2Data = getPriorityDefinition(assessment.priority2 || "");
      
      // Get CTA content
      const ctaContent = getCTAContent();

      res.json({
        assessment: {
          id: assessment.id,
          totalScore: assessment.totalScore,
          zone: assessment.zone,
          strategicIdentity: assessment.strategicIdentity,
          visibilityPositioning: assessment.visibilityPositioning,
          politicalCapital: assessment.politicalCapital,
          priority1: assessment.priority1,
          priority2: assessment.priority2,
          pdfUrl: assessment.pdfUrl,
          completedAt: assessment.completedAt
        },
        zoneInterpretation: zoneData,
        priorities: {
          priority1: priority1Data,
          priority2: priority2Data
        },
        cta: ctaContent
      });
    } catch (error) {
      console.error("Error fetching results:", error);
      res.status(500).json({ message: "Failed to fetch results" });
    }
  });

  // Generate PDF report (authenticated)
  app.post("/api/assessments/:id/generate-pdf", authenticateToken, async (req, res) => {
    try {
      const assessment = await storage.getAssessment(req.params.id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Ensure user owns this assessment
      if (assessment.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Ensure assessment is completed
      if (!assessment.completedAt) {
        return res.status(400).json({ message: "Assessment not completed" });
      }

      // Generate PDF
      const pdfPath = await generatePDFReport(assessment, req.user!);
      const pdfUrl = `/api/reports/${assessment.id}.pdf`;
      
      // Update assessment with PDF URL
      const updatedAssessment = await storage.updatePdfUrl(assessment.id, pdfUrl);

      res.json({ 
        message: "PDF generated successfully", 
        pdfUrl,
        assessment: updatedAssessment 
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // Serve PDF reports (authenticated)
  app.get("/api/reports/:filename", authenticateToken, async (req, res) => {
    try {
      const filename = req.params.filename;
      const assessmentId = filename.replace(".pdf", "");
      
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Ensure user owns this assessment
      if (assessment.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const filePath = path.join(process.cwd(), "storage", "reports", filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "PDF not found" });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error serving PDF:", error);
      res.status(500).json({ message: "Failed to serve PDF" });
    }
  });

  // Admin routes
  const { setupAdminAuth, authenticateAdmin } = await import("./admin-auth");
  const { syncSubscriber, handleWebhook } = await import("./mailerlite-service");
  
  setupAdminAuth(app);

  // Get pending assessments (admin only)
  app.get("/api/admin/assessments/pending", authenticateAdmin, async (req, res) => {
    try {
      const pendingAssessments = await storage.getPendingAssessments();
      
      // Include user info with each assessment
      const assessmentsWithUsers = await Promise.all(
        pendingAssessments.map(async (assessment) => {
          const user = await storage.getUser(assessment.userId);
          return {
            ...assessment,
            user: user ? { id: user.id, name: user.name, email: user.email } : null
          };
        })
      );

      res.json(assessmentsWithUsers);
    } catch (error) {
      console.error("Error fetching pending assessments:", error);
      res.status(500).json({ message: "Failed to fetch pending assessments" });
    }
  });

  // Approve assessment and send to MailerLite (admin only)
  app.post("/api/admin/assessments/:id/approve", authenticateAdmin, async (req, res) => {
    try {
      const assessment = await storage.getAssessment(req.params.id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      if (!assessment.reportGenerated) {
        return res.status(400).json({ message: "PDF report must be generated before approval" });
      }

      // Get user info
      const user = await storage.getUser(assessment.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Mark as approved
      await storage.approveAssessment(req.params.id);

      // Sync to MailerLite (this triggers email automation)
      try {
        const result = await syncSubscriber(user, assessment);
        res.json({ 
          success: true, 
          message: "Assessment approved and synced to MailerLite",
          subscriberId: result.subscriberId 
        });
      } catch (mlError: any) {
        // Assessment is approved but MailerLite sync failed
        console.error("MailerLite sync failed:", mlError);
        res.json({
          success: true,
          message: "Assessment approved but MailerLite sync failed",
          error: mlError.message
        });
      }
    } catch (error) {
      console.error("Error approving assessment:", error);
      res.status(500).json({ message: "Failed to approve assessment" });
    }
  });

  // Get all assessments with stats (admin only)
  app.get("/api/admin/assessments", authenticateAdmin, async (req, res) => {
    try {
      // This would need to be implemented in storage to get all assessments
      // For now, just get pending ones
      const assessments = await storage.getPendingAssessments();
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  // MailerLite webhook endpoint
  app.post("/api/webhooks/mailerlite", async (req, res) => {
    try {
      await handleWebhook(req.body);
      res.sendStatus(200);
    } catch (error) {
      console.error("Webhook error:", error);
      res.sendStatus(500);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

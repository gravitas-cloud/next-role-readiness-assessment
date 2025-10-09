import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Assessment, User } from "@shared/schema";
import { ZONES, PRIORITIES, generateRecommendations } from "./content-library";

// Ensure storage directory exists
const STORAGE_DIR = path.join(process.cwd(), "storage", "reports");
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

export async function generatePDFReport(assessment: Assessment, user: User): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const fileName = `${assessment.id}.pdf`;
    const filePath = path.join(STORAGE_DIR, fileName);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Page dimensions
    const pageWidth = doc.page.width;
    const margin = 50;
    const textWidth = pageWidth - (margin * 2);

    // Get zone and priority data
    const zoneData = ZONES[assessment.zone || "ZONE_1"];
    const priority1Data = PRIORITIES[assessment.priority1 || "Strategic Business Thinking"];
    const priority2Data = PRIORITIES[assessment.priority2 || "Strategic Communication"];
    const recommendations = generateRecommendations(
      assessment.zone || "ZONE_1",
      assessment.priority1 || "Strategic Business Thinking",
      assessment.priority2 || "Strategic Communication"
    );

    // PAGE 1: Strategic Readiness Profile
    
    // Header - Gravitas Academy
    doc.fontSize(24)
       .fillColor("#1E40AF")
       .text("Next Role Readiness Diagnostic", margin, doc.y, { 
         width: textWidth,
         align: "center" 
       });

    doc.moveDown(0.5);
    doc.fontSize(12)
       .fillColor("#6B7280")
       .text(`Results for ${user.name}`, margin, doc.y, { 
         width: textWidth,
         align: "center" 
       });
    
    doc.fontSize(10)
       .fillColor("#9CA3AF")
       .text(new Date().toLocaleDateString("en-IN", { 
         year: "numeric", 
         month: "long", 
         day: "numeric" 
       }), margin, doc.y, { 
         width: textWidth,
         align: "center" 
       });

    // Zone Section
    doc.moveDown(2);
    doc.fontSize(22)
       .fillColor("#000000")
       .text(zoneData.title, margin, doc.y, { 
         width: textWidth,
         align: "left" 
       });

    doc.fontSize(11)
       .fillColor("#6B7280")
       .text(`Your Score: ${assessment.totalScore}/60 points (${zoneData.scoreRange})`, margin, doc.y, { 
         width: textWidth,
         align: "left" 
       });

    // Visual bar chart for dimensions
    doc.moveDown(1.5);
    drawBarChart(doc, {
      "Strategic Identity": assessment.strategicIdentity || 0,
      "Visibility & Positioning": assessment.visibilityPositioning || 0,
      "Political Capital": assessment.politicalCapital || 0
    });

    // Zone interpretation
    doc.moveDown(2);
    doc.fontSize(14)
       .fillColor("#000000")
       .text("What This Means:", margin, doc.y, { 
         width: textWidth,
         underline: true 
       });

    doc.moveDown(0.5);
    doc.fontSize(10)
       .fillColor("#374151")
       .text(zoneData.currentReality, margin, doc.y, { 
         width: textWidth,
         align: "justify" 
       });

    doc.moveDown(1);
    doc.fontSize(10)
       .fillColor("#374151")
       .text(zoneData.meaning, margin, doc.y, { 
         width: textWidth,
         align: "justify" 
       });

    // Key Insight
    doc.moveDown(1.5);
    doc.fontSize(14)
       .fillColor("#1E40AF")
       .text("Your #1 Breakthrough Priority:", margin, doc.y, { 
         width: textWidth,
         align: "left" 
       });
    
    doc.moveDown(0.5);
    doc.fontSize(12)
       .fillColor("#000000")
       .text(assessment.priority1 || "Strategic Business Thinking", margin, doc.y, { 
         width: textWidth,
         align: "left" 
       });

    // PAGE 2: Next Steps
    doc.addPage();
    
    doc.fontSize(20)
       .fillColor("#1E40AF")
       .text("Your Development Roadmap", margin, doc.y, { 
         width: textWidth,
         align: "left" 
       });

    // Priority 1
    doc.moveDown(1.5);
    doc.fontSize(14)
       .fillColor("#000000")
       .text(`Priority #1: ${assessment.priority1}`, margin, doc.y, { 
         width: textWidth 
       });

    doc.moveDown(0.5);
    doc.fontSize(10)
       .fillColor("#374151")
       .text(priority1Data.description, margin, doc.y, { 
         width: textWidth,
         align: "justify" 
       });

    // Priority 2
    doc.moveDown(1.5);
    doc.fontSize(14)
       .fillColor("#000000")
       .text(`Priority #2: ${assessment.priority2}`, margin, doc.y, { 
         width: textWidth 
       });

    doc.moveDown(0.5);
    doc.fontSize(10)
       .fillColor("#374151")
       .text(priority2Data.description, margin, doc.y, { 
         width: textWidth,
         align: "justify" 
       });

    // Immediate Actions
    doc.moveDown(1.5);
    doc.fontSize(12)
       .fillColor("#000000")
       .text("This Week - Immediate Actions:", margin, doc.y, { 
         width: textWidth,
         underline: true 
       });

    doc.moveDown(0.5);
    recommendations.immediate.forEach((action, idx) => {
      doc.fontSize(10)
         .fillColor("#374151")
         .text(`${idx + 1}. ${action}`, margin, doc.y, { 
           width: textWidth,
           align: "left" 
         });
      doc.moveDown(0.3);
    });

    // 30-Day Plan
    doc.moveDown(1);
    doc.fontSize(12)
       .fillColor("#000000")
       .text("Next 30 Days - Development Plan:", margin, doc.y, { 
         width: textWidth,
         underline: true 
       });

    doc.moveDown(0.5);
    recommendations.thirtyDay.slice(0, 3).forEach((action, idx) => {
      doc.fontSize(10)
         .fillColor("#374151")
         .text(`${idx + 1}. ${action}`, margin, doc.y, { 
           width: textWidth,
           align: "left" 
         });
      doc.moveDown(0.3);
    });

    // CTA Box
    const ctaY = doc.page.height - 180;
    doc.rect(margin, ctaY, textWidth, 110)
       .fillAndStroke("#F3F4F6", "#D1D5DB");

    doc.fillColor("#000000")
       .fontSize(16)
       .text("Ready to Accelerate Your Journey?", margin + 10, ctaY + 15, { 
         width: textWidth - 20 
       });

    doc.moveDown(0.8);
    const ctaTextX = margin + 10;
    doc.fontSize(11)
       .fillColor("#1E40AF")
       .text("→ Take Complete Assessment (₹8,500)", ctaTextX, doc.y, { 
         width: textWidth - 20 
       });
    doc.fontSize(11)
       .fillColor("#1E40AF")
       .text("→ Join Free Workshop", ctaTextX, doc.y + 5, { 
         width: textWidth - 20 
       });
    doc.fontSize(11)
       .fillColor("#1E40AF")
       .text("→ Book 15-min Consultation", ctaTextX, doc.y + 5, { 
         width: textWidth - 20 
       });

    doc.end();

    stream.on("finish", () => {
      resolve(filePath);
    });

    stream.on("error", reject);
  });
}

function drawBarChart(doc: PDFKit.PDFDocument, data: Record<string, number>) {
  const maxScore = 20;
  const barHeight = 25;
  const spacing = 15;
  const startY = doc.y;
  const labelWidth = 180;
  const barStartX = 50 + labelWidth;
  const barMaxWidth = 250;

  Object.entries(data).forEach(([label, score], idx) => {
    const y = startY + (idx * (barHeight + spacing));
    const percentage = (score / maxScore) * 100;
    const barWidth = (percentage / 100) * barMaxWidth;

    // Label
    doc.fontSize(10)
       .fillColor("#374151")
       .text(label, 50, y + 7, { width: labelWidth, align: "left" });

    // Background bar (light gray)
    doc.rect(barStartX, y, barMaxWidth, barHeight)
       .fillAndStroke("#E5E7EB", "#D1D5DB");

    // Filled bar (score) - color based on percentage
    let barColor = "#EF4444"; // Red for low (< 50%)
    if (percentage >= 75) {
      barColor = "#10B981"; // Green for high (>= 75%)
    } else if (percentage >= 50) {
      barColor = "#F59E0B"; // Orange for medium (50-74%)
    }

    if (barWidth > 0) {
      doc.rect(barStartX, y, barWidth, barHeight)
         .fill(barColor);
    }

    // Score text
    doc.fillColor("#000000")
       .fontSize(10)
       .text(`${score}/${maxScore}`, barStartX + barMaxWidth + 15, y + 7);
  });

  doc.moveDown(4);
}

// Clean up old PDFs (older than 30 days)
export function cleanupOldPDFs() {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  fs.readdir(STORAGE_DIR, (err, files) => {
    if (err) {
      console.error("Error reading storage directory:", err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(STORAGE_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error reading file stats:", err);
          return;
        }

        if (stats.mtime.getTime() < thirtyDaysAgo) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting old PDF:", err);
            } else {
              console.log(`Deleted old PDF: ${file}`);
            }
          });
        }
      });
    });
  });
}

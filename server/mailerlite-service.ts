import axios from "axios";
import { Assessment, User } from "@shared/schema";
import { storage } from "./storage";

const MAILERLITE_API = "https://api.mailerlite.com/api/v2";

interface MailerLiteSubscriber {
  email: string;
  name: string;
  fields: {
    zone: string;
    total_score: number;
    priority_1: string;
    priority_2: string;
    assessment_date: string;
    report_url: string;
  };
}

export async function syncSubscriber(user: User, assessment: Assessment): Promise<{ success: boolean; subscriberId?: string }> {
  const apiKey = process.env.MAILERLITE_API_KEY;
  
  if (!apiKey) {
    console.error("MAILERLITE_API_KEY not configured");
    throw new Error("MailerLite API key not configured");
  }

  try {
    // 1. Add/update subscriber
    const subscriberData: MailerLiteSubscriber = {
      email: user.email,
      name: user.name,
      fields: {
        zone: assessment.zone || "ZONE_1",
        total_score: assessment.totalScore || 0,
        priority_1: assessment.priority1 || "",
        priority_2: assessment.priority2 || "",
        assessment_date: (assessment.completedAt || new Date()).toISOString(),
        report_url: `${process.env.APP_URL || ""}/api/reports/${assessment.id}.pdf`
      }
    };

    const response = await axios.post(
      `${MAILERLITE_API}/subscribers`,
      subscriberData,
      {
        headers: {
          "X-MailerLite-ApiKey": apiKey,
          "Content-Type": "application/json"
        }
      }
    );

    const subscriberId = response.data.id;

    // 2. Add to zone-specific group
    const groupMap: Record<string, string | undefined> = {
      "ZONE_1": process.env.MAILERLITE_GROUP_ZONE_1,
      "ZONE_2": process.env.MAILERLITE_GROUP_ZONE_2,
      "ZONE_3": process.env.MAILERLITE_GROUP_ZONE_3,
      "ZONE_4": process.env.MAILERLITE_GROUP_ZONE_4
    };

    const groupId = groupMap[assessment.zone || "ZONE_1"];
    
    if (groupId) {
      await axios.post(
        `${MAILERLITE_API}/groups/${groupId}/subscribers/${subscriberId}`,
        {},
        {
          headers: { "X-MailerLite-ApiKey": apiKey }
        }
      );
    }

    // 3. Update assessment record
    await storage.updateMailerLiteSync(assessment.id, subscriberId.toString());

    return { success: true, subscriberId: subscriberId.toString() };

  } catch (error: any) {
    console.error("MailerLite sync error:", error.response?.data || error.message);
    throw new Error(`Failed to sync with MailerLite: ${error.response?.data?.error?.message || error.message}`);
  }
}

// Webhook handler for delivery status
export async function handleWebhook(data: any): Promise<void> {
  const { type } = data;

  switch (type) {
    case "subscriber.created":
      console.log("MailerLite: Subscriber created:", data.data?.email);
      break;

    case "campaign.sent":
      console.log("MailerLite: Campaign sent:", data.data?.campaign_id);
      break;

    case "subscriber.bounced":
      console.log("MailerLite: Email bounced:", data.data?.email);
      break;

    default:
      console.log("MailerLite: Unknown webhook type:", type);
  }
}

import axios from "axios";
import { Assessment, User } from "@shared/schema";
import { storage } from "./storage";

const MAILERLITE_API = "https://connect.mailerlite.com/api";

interface MailerLiteSubscriber {
  email: string;
  fields: {
    name: string;
    last_name?: string;
    company?: string;
    city?: string;
    country?: string;
    state?: string;
    z_i_p?: string;
    phone?: string;
  };
  groups?: string[];
}

export async function syncSubscriber(user: User, assessment: Assessment): Promise<{ success: boolean; subscriberId?: string }> {
  const apiKey = process.env.MAILERLITE_API_KEY;
  
  if (!apiKey) {
    console.error("MAILERLITE_API_KEY not configured");
    throw new Error("MailerLite API key not configured");
  }

  try {
    // Map zone to group ID
    const groupMap: Record<string, string | undefined> = {
      "ZONE_1": process.env.MAILERLITE_GROUP_ZONE_1,
      "ZONE_2": process.env.MAILERLITE_GROUP_ZONE_2,
      "ZONE_3": process.env.MAILERLITE_GROUP_ZONE_3,
      "ZONE_4": process.env.MAILERLITE_GROUP_ZONE_4
    };

    const groupId = groupMap[assessment.zone || "ZONE_1"];
    
    // Build groups array (only include if groupId exists)
    const groups = groupId ? [groupId] : [];

    // Prepare subscriber data for API v3
    // Note: Custom fields beyond standard ones need to be created in MailerLite first
    // For now, we'll use the 'company' field to store zone info
    const subscriberData: MailerLiteSubscriber = {
      email: user.email,
      fields: {
        name: user.name,
        company: `${assessment.zone} - Score: ${assessment.totalScore}` // Using company field for assessment info
      },
      groups: groups
    };

    // API v3: Create/update subscriber and add to group in single request
    const response = await axios.post(
      `${MAILERLITE_API}/subscribers`,
      subscriberData,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
    );

    const subscriberId = response.data.data.id;

    // Update assessment record
    await storage.updateMailerLiteSync(assessment.id, subscriberId.toString());

    console.log(`✅ MailerLite sync successful: ${user.email} → ${assessment.zone} (Group: ${groupId || 'none'})`);

    return { success: true, subscriberId: subscriberId.toString() };

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("❌ MailerLite sync error:", {
      email: user.email,
      zone: assessment.zone,
      status: error.response?.status,
      error: error.response?.data || errorMessage
    });
    throw new Error(`Failed to sync with MailerLite: ${errorMessage}`);
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

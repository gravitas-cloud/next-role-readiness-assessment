export interface ZoneData {
  title: string;
  scoreRange: string;
  currentReality: string;
  gap: string;
  meaning: string;
  priorities: string[];
  nextStep: string;
  ctaType: string;
}

export interface PriorityData {
  description: string;
  developmentActions: string[];
  frameworks: string[];
  timeframe: string;
}

export const ZONES: Record<string, ZoneData> = {
  ZONE_1: {
    title: "Technical Expert",
    scoreRange: "12-29 points",
    currentReality: "You're operating primarily as a high-level technologist. You deliver exceptional technical results, but you're largely invisible at the strategic table.",
    gap: "Significant distance to strategic leader identity. You're solving technical problems while others are shaping business direction.",
    meaning: "You're highly competent, but positioned wrong. The organization sees you as an implementer, not a strategist.",
    priorities: [
      "Strategic Business Thinking: Learn to speak the language of business value, not technical features",
      "Executive Relationships: Build authentic connections with C-suite leaders outside IT"
    ],
    nextStep: "Take the Complete Next Role Readiness Assessment to identify your specific breakthrough capabilities.",
    ctaType: "paid_assessment"
  },
  ZONE_2: {
    title: "Emerging Strategist",
    scoreRange: "30-44 points",
    currentReality: "You're beginning to think strategically, but your voice isn't yet influential in key business decisions. You understand the bigger picture but struggle to shape it.",
    gap: "Moderate distance to strategic leader identity. You see the path but lack consistent executive presence and political savvy.",
    meaning: "You're transitioning from doer to thinker, but not yet recognized as a strategic partner by the C-suite.",
    priorities: [
      "Strategic Communication: Master the art of executive storytelling and influence",
      "Political Capital: Build cross-functional alliances and navigate organizational dynamics"
    ],
    nextStep: "Join our Strategic Leadership Workshop to accelerate your transition from emerging to established strategist.",
    ctaType: "workshop"
  },
  ZONE_3: {
    title: "Strategic Contributor",
    scoreRange: "45-54 points",
    currentReality: "You're actively contributing to strategic conversations and business decisions. Your voice carries weight, but you're not yet driving the agenda.",
    gap: "Small distance to strategic leader identity. You're in the room, but not yet setting the direction.",
    meaning: "You're recognized as a strategic thinker, but need to elevate from contributor to architect of business strategy.",
    priorities: [
      "Executive Presence: Shift from participant to agenda-setter in strategic forums",
      "Business Architecture: Move from tactical execution to shaping long-term business direction"
    ],
    nextStep: "Book a consultation to create your personalized roadmap for establishing yourself as a strategic architect.",
    ctaType: "consultation"
  },
  ZONE_4: {
    title: "Strategic Leader",
    scoreRange: "55-60 points",
    currentReality: "You're operating as a true strategic leader. You shape business direction, influence key decisions, and are recognized as a strategic partner by the C-suite.",
    gap: "Minimal distance to next-level leadership. You're ready for C-suite transitions or already operating at that level.",
    meaning: "You've successfully made the identity shift from technical expert to strategic business leader.",
    priorities: [
      "C-Suite Readiness: Prepare for board-level conversations and enterprise-wide accountability",
      "Legacy Building: Establish yourself as a transformational leader who shapes organizational future"
    ],
    nextStep: "Join our exclusive C-Suite Transition Program to prepare for your next executive role.",
    ctaType: "executive_program"
  }
};

export const PRIORITIES: Record<string, PriorityData> = {
  "Strategic Business Thinking": {
    description: "You need to shift from technical problem-solving to business value creation. This means understanding business models, speaking in ROI and competitive advantage, and connecting every technical decision to enterprise outcomes.",
    developmentActions: [
      "Complete the Business Model Canvas for your organization (see framework template)",
      "Identify 3 strategic business metrics your technology decisions impact",
      "Practice explaining your last 3 technical initiatives in pure business terms"
    ],
    frameworks: [
      "Business Model Canvas",
      "Strategic Intent Statement",
      "Value Creation Framework"
    ],
    timeframe: "30 days to show visible improvement"
  },
  "Strategic Communication": {
    description: "You need to master executive-level communication. This means crafting compelling narratives, influencing without authority, and positioning technology as a strategic enabler rather than a cost center.",
    developmentActions: [
      "Develop your Strategic Narrative Template (problem-solution-impact framework)",
      "Record and analyze your last 3 executive presentations for clarity and impact",
      "Practice the 'Executive Elevator Pitch' for your key initiatives"
    ],
    frameworks: [
      "Strategic Narrative Framework",
      "Executive Communication Matrix",
      "Influence Without Authority Model"
    ],
    timeframe: "30 days to demonstrate measurable improvement"
  },
  "Cross-Functional Influence": {
    description: "You need to build political capital and cross-functional influence. This means developing authentic relationships with C-suite peers, understanding organizational dynamics, and navigating competing priorities to drive outcomes.",
    developmentActions: [
      "Map your stakeholder influence network (identify key relationships and gaps)",
      "Schedule 1:1 strategic conversations with 3 C-suite leaders outside IT",
      "Join or initiate a cross-functional strategic initiative"
    ],
    frameworks: [
      "Stakeholder Influence Map",
      "Political Navigation Framework",
      "Coalition Building Strategy"
    ],
    timeframe: "60 days to establish visible cross-functional presence"
  }
};

export interface Recommendation {
  immediate: string[];
  thirtyDay: string[];
  ninetyDay: string[];
  resources: string[];
}

export function generateRecommendations(zone: string, priority1: string, priority2: string): Recommendation {
  const recommendations: Recommendation = {
    immediate: [],
    thirtyDay: [],
    ninetyDay: [],
    resources: []
  };

  // Immediate actions based on zone
  if (zone === "ZONE_1" || zone === "ZONE_2") {
    recommendations.immediate.push(
      "Register for our free 'Next Role Readiness' workshop",
      "Download the Business Model Canvas template",
      "Schedule 1 coffee chat with a C-suite executive this week"
    );
  } else if (zone === "ZONE_3" || zone === "ZONE_4") {
    recommendations.immediate.push(
      "Book a strategic positioning consultation",
      "Join the Strategic Leadership Community",
      "Download the Executive Presence Toolkit"
    );
  }

  // 30-day actions based on priorities
  const priority1Data = PRIORITIES[priority1];
  const priority2Data = PRIORITIES[priority2];
  
  if (priority1Data) {
    recommendations.thirtyDay.push(...priority1Data.developmentActions);
  }
  recommendations.thirtyDay.push("Join Strategic Leadership Community for weekly frameworks");

  // 90-day transformation path
  recommendations.ninetyDay = [
    "Complete the paid assessment for detailed roadmap",
    "Work 1:1 with coach on specific positioning gaps",
    "Execute on personalized development plan"
  ];

  // Resources
  if (priority1Data) {
    recommendations.resources.push(...priority1Data.frameworks);
  }
  if (priority2Data) {
    recommendations.resources.push(...priority2Data.frameworks);
  }
  recommendations.resources.push("Executive Presence Toolkit (free download)");

  return recommendations;
}

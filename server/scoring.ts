import contentLibrary from "./content-library/assessment-content.json";

export interface AssessmentResponses {
  [key: string]: number; // q1: 3, q2: 4, etc.
}

export interface ScoringResult {
  strategicIdentity: number;
  visibilityPositioning: number;
  politicalCapital: number;
  totalScore: number;
  zone: string;
  priority1: string;
  priority2: string;
}

export function calculateAssessmentScore(responses: AssessmentResponses): ScoringResult {
  // Validate all 12 questions are answered
  const questionIds = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12'];
  for (const qId of questionIds) {
    if (!responses[qId] || responses[qId] < 1 || responses[qId] > 5) {
      throw new Error(`Invalid response for ${qId}`);
    }
  }

  // Calculate dimension scores using content library structure
  const strategicIdentity = responses.q1 + responses.q2 + responses.q3 + responses.q4;
  const visibilityPositioning = responses.q5 + responses.q6 + responses.q7 + responses.q8;
  const politicalCapital = responses.q9 + responses.q10 + responses.q11 + responses.q12;
  
  const totalScore = strategicIdentity + visibilityPositioning + politicalCapital;
  
  // Determine zone based on content library ranges
  const zoneRanges = contentLibrary.assessment_content.scoring_logic.zone_determination;
  let zone = "ZONE_1";
  
  for (const [zoneId, range] of Object.entries(zoneRanges)) {
    if (totalScore >= range.min_score && totalScore <= range.max_score) {
      zone = zoneId;
      break;
    }
  }
  
  // Determine priorities (lowest 2 dimensions by percentage)
  const dimensionMapping = contentLibrary.assessment_content.scoring_logic.priority_determination.dimension_mapping;
  
  const dimensions = [
    { 
      id: 'strategic_identity', 
      name: dimensionMapping.strategic_identity, 
      score: strategicIdentity, 
      max: 20 
    },
    { 
      id: 'visibility_positioning', 
      name: dimensionMapping.visibility_positioning, 
      score: visibilityPositioning, 
      max: 20 
    },
    { 
      id: 'political_capital', 
      name: dimensionMapping.political_capital, 
      score: politicalCapital, 
      max: 20 
    }
  ];
  
  // Calculate percentages and sort by lowest first
  dimensions.forEach(d => {
    (d as any).percentage = (d.score / d.max) * 100;
  });
  dimensions.sort((a, b) => (a as any).percentage - (b as any).percentage);
  
  return {
    strategicIdentity,
    visibilityPositioning,
    politicalCapital,
    totalScore,
    zone,
    priority1: dimensions[0].name,
    priority2: dimensions[1].name
  };
}

// Get zone interpretation from content library
export function getZoneInterpretation(zone: string) {
  return contentLibrary.assessment_content.zones[zone as keyof typeof contentLibrary.assessment_content.zones] || null;
}

// Get priority definition from content library
export function getPriorityDefinition(priorityName: string) {
  return contentLibrary.assessment_content.priority_definitions[priorityName as keyof typeof contentLibrary.assessment_content.priority_definitions] || null;
}

// Get all questions from content library
export function getAssessmentQuestions() {
  return {
    opening: contentLibrary.assessment_content.opening_content,
    sections: contentLibrary.assessment_content.sections,
    questions: contentLibrary.assessment_content.questions,
    metadata: contentLibrary.assessment_content.metadata
  };
}

// Get CTA content from content library
export function getCTAContent() {
  return contentLibrary.assessment_content.cta_content;
}

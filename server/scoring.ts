export interface AssessmentResponses {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  q12: number;
}

export interface DimensionScore {
  name: string;
  score: number;
  max: number;
  percentage: number;
}

export interface ScoringResult {
  strategicIdentity: number;
  visibilityPositioning: number;
  politicalCapital: number;
  totalScore: number;
  zone: string;
  priority1: string;
  priority2: string;
  dimensionBreakdown: DimensionScore[];
}

export function calculateScores(responses: AssessmentResponses): ScoringResult {
  const scores = {
    strategicIdentity: responses.q1 + responses.q2 + responses.q3 + responses.q4,
    visibilityPositioning: responses.q5 + responses.q6 + responses.q7 + responses.q8,
    politicalCapital: responses.q9 + responses.q10 + responses.q11 + responses.q12,
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  // Determine zone (total out of 60)
  let zone: string;
  if (totalScore >= 12 && totalScore <= 29) {
    zone = "ZONE_1";
  } else if (totalScore >= 30 && totalScore <= 44) {
    zone = "ZONE_2";
  } else if (totalScore >= 45 && totalScore <= 54) {
    zone = "ZONE_3";
  } else if (totalScore >= 55 && totalScore <= 60) {
    zone = "ZONE_4";
  } else {
    zone = "ZONE_1"; // Default fallback
  }

  // Define dimensions with proper names
  const dimensions: DimensionScore[] = [
    { 
      name: "Strategic Business Thinking", 
      score: scores.strategicIdentity, 
      max: 20,
      percentage: 0 
    },
    { 
      name: "Strategic Communication", 
      score: scores.visibilityPositioning, 
      max: 20,
      percentage: 0 
    },
    { 
      name: "Cross-Functional Influence", 
      score: scores.politicalCapital, 
      max: 20,
      percentage: 0 
    }
  ];

  // Calculate percentage scores
  dimensions.forEach(d => {
    d.percentage = (d.score / d.max) * 100;
  });

  // Sort by percentage (lowest first) to get priorities
  dimensions.sort((a, b) => a.percentage - b.percentage);

  return {
    ...scores,
    totalScore,
    zone,
    priority1: dimensions[0].name,
    priority2: dimensions[1].name,
    dimensionBreakdown: dimensions
  };
}

export interface PersonalizationSignals {
  preferEasyRecipes: number;
  preferIngredientFit: number;
  preferQuickRecipes: number;
  preferTechniqueGuidance: number;
}

export interface FeedbackIssueCounts {
  "cutting-meat-hard": number;
  "missing-ingredients": number;
  "oil-splatter": number;
  "took-longer-than-expected": number;
}

export interface PersonalizationInsight {
  averageRating: number;
  confidence: number;
  feedbackCount: number;
  insights: string[];
  issueCounts: FeedbackIssueCounts;
  signals: PersonalizationSignals;
  updatedAt: string | null;
}

export type ProfileTab = "cai-dat" | "ca-nhan-hoa" | "thong-tin";

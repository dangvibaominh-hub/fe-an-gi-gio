import type { RecipeSummary } from "@/lib/types/recipe";
import type { PaginationMeta } from "@/lib/types/api";

export type RecommendationSource = "database" | "gemini" | "empty";

export interface RecommendationMatch {
  matchedIngredients: string[];
  missingIngredients: string[];
  score: number;
}

export interface RecipeRecommendation extends RecipeSummary {
  match: RecommendationMatch;
}

export interface RecommendationMeta extends PaginationMeta {
  source: RecommendationSource;
}

export interface RecommendationFilters {
  category?: string;
  difficulties?: Array<"de" | "trung-binh" | "kho">;
  maxCookTimeMinutes?: number;
  servings?: number;
}

export interface RecommendationRequest {
  filters?: RecommendationFilters;
  ingredients: string[];
  limit?: number;
  page?: number;
}

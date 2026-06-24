import type { RecipeSummary } from "@/lib/types/recipe";

export type CookingSessionStatus = "IN_PROGRESS" | "COMPLETED";

export interface CookingFeedbackSummary {
  issues: FeedbackIssue[];
  note: string | null;
  rating: number;
  submittedAt: string;
}

export interface CookingSession {
  completedAt: string | null;
  currentStep: number;
  feedback: CookingFeedbackSummary | null;
  id: string;
  recipe: RecipeSummary;
  servings: number;
  startedAt: string;
  status: CookingSessionStatus;
  totalSteps: number;
  updatedAt: string;
}

export interface StartCookingSessionRequest {
  recipeSlug: string;
  servings?: number;
}

export interface UpdateCookingSessionRequest {
  currentStep?: number;
  servings?: number;
}

export type CookingHistorySort =
  | "completed-at-desc"
  | "rating-desc"
  | "started-at-desc";

export type FeedbackIssue =
  | "cutting-meat-hard"
  | "missing-ingredients"
  | "oil-splatter"
  | "took-longer-than-expected";

export interface SubmitFeedbackRequest {
  issues?: FeedbackIssue[];
  note?: string;
  rating: number;
}

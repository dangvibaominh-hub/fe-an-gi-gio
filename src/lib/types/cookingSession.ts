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

export const FEEDBACK_ISSUES = [
  "cutting-meat-hard",
  "hard-to-follow-steps",
  "taste-not-right",
  "oil-splatter",
  "took-longer-than-expected",
  "missing-ingredients",
  "too-oily",
  "not-crispy",
  "pan-sticking-or-burning",
  "vegetables-too-soft",
  "soup-too-bland-or-salty",
  "ingredients-overcooked",
  "steamed-unevenly",
  "fishy-smell",
  "too-dry",
  "too-sweet",
  "texture-failed",
  "temperature-control-hard",
  "bland-flavor",
  "lacks-protein",
] as const;

export type FeedbackIssue = (typeof FEEDBACK_ISSUES)[number];

export interface CookingFeedbackOption {
  label: string;
  value: FeedbackIssue;
}

export interface SubmitFeedbackRequest {
  issues?: FeedbackIssue[];
  note?: string;
  rating: number;
}

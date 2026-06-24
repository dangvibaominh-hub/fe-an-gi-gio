import { apiPost } from "@/lib/api/client";
import { ApiRequestError } from "@/lib/api/errors";
import type {
  RecipeRecommendation,
  RecommendationMeta,
  RecommendationRequest,
} from "@/lib/types/recommendation";

export interface RecommendRecipesResult {
  items: RecipeRecommendation[];
  meta: RecommendationMeta;
}

export async function recommendRecipes(
  request: RecommendationRequest,
): Promise<RecommendRecipesResult> {
  const response = await apiPost<RecipeRecommendation[], RecommendationRequest>(
    "/api/v1/recommendations",
    request,
  );

  if (!response.meta) {
    throw new ApiRequestError(
      "Thiếu metadata từ API gợi ý.",
      500,
      "MISSING_RECOMMENDATION_META",
    );
  }

  return {
    items: response.data,
    meta: response.meta as RecommendationMeta,
  };
}

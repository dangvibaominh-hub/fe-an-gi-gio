import { apiGet } from "@/lib/api/client";
import { ApiRequestError } from "@/lib/api/errors";
import { DEFAULT_RECIPE_LIST_LIMIT } from "@/lib/constants/recipe";
import type { PaginationMeta } from "@/lib/types/api";
import type {
  RecipeDetail,
  RecipeDifficulty,
  RecipeSummary,
} from "@/lib/types/recipe";

export type RecipeSort = "difficulty-asc" | "cook-time-asc" | "newest";

export interface ListRecipesParams {
  category?: string;
  difficulties?: RecipeDifficulty[];
  limit?: number;
  maxCookTimeMinutes?: number;
  page?: number;
  servings?: number;
  sort?: RecipeSort;
}

export interface ListRecipesResult {
  items: RecipeSummary[];
  meta: PaginationMeta;
}

export async function listRecipes(
  params: ListRecipesParams = {},
): Promise<ListRecipesResult> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  searchParams.set(
    "limit",
    String(params.limit ?? DEFAULT_RECIPE_LIST_LIMIT),
  );

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.maxCookTimeMinutes !== undefined) {
    searchParams.set(
      "maxCookTimeMinutes",
      String(params.maxCookTimeMinutes),
    );
  }

  if (params.servings !== undefined) {
    searchParams.set("servings", String(params.servings));
  }

  for (const difficulty of params.difficulties ?? []) {
    searchParams.append("difficulty", difficulty);
  }

  const query = searchParams.toString();
  const path = query ? `/api/v1/recipes?${query}` : "/api/v1/recipes";
  const response = await apiGet<RecipeSummary[]>(path);

  if (!response.meta) {
    throw new ApiRequestError(
      "Thiếu metadata phân trang từ API công thức.",
      500,
      "MISSING_PAGINATION_META",
    );
  }

  return {
    items: response.data,
    meta: response.meta,
  };
}

export async function getRecipeBySlug(
  slug: string,
): Promise<RecipeDetail | null> {
  try {
    const response = await apiGet<RecipeDetail>(
      `/api/v1/recipes/${encodeURIComponent(slug)}`,
      { revalidate: false },
    );

    return response.data;
  } catch (error) {
    if (error instanceof ApiRequestError && error.isNotFound) {
      return null;
    }

    throw error;
  }
}

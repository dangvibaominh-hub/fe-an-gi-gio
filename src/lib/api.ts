import { getApiBaseUrl } from "@/lib/config";
import type {
  AuthSession,
  CookingFeedbackSummary,
  CookingSession,
  FeedbackIssue,
  PersonalizationInsight,
  PublicUser,
  RecipeDetail,
  RecipeDifficulty,
  RecipeRecommendation,
  RecipeSummary,
  RecommendationSource,
  SavedRecipe,
} from "@/lib/types";

export interface ApiMeta {
  limit?: number;
  page?: number;
  total?: number;
  totalPages?: number;
  source?: RecommendationSource;
  personalization?: PersonalizationInsight;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: ApiMeta;
  error?: { message?: string };
}

export interface ApiResult<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  accessToken?: string | null;
  body?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export async function requestApi<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResult<T>> {
  const { accessToken, body, headers, ...init } = options;
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    cache: "no-store",
    ...init,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) {
    return { data: undefined as T, meta: {} };
  }

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    throw new ApiError(
      payload.error?.message ?? "API request failed",
      response.status,
    );
  }

  return { data: payload.data, meta: payload.meta ?? {} };
}

export async function getRecipes(params: URLSearchParams = new URLSearchParams()) {
  const query = params.toString();
  return requestApi<RecipeSummary[]>(`/recipes${query ? `?${query}` : ""}`);
}

export async function getRecipeBySlug(slug: string) {
  return requestApi<RecipeDetail>(`/recipes/${slug}`);
}

export async function getCategories() {
  return requestApi<Array<{ id: string; slug: string; name: string }>>("/categories");
}

export interface RecommendationRequest {
  ingredients: string[];
  filters?: {
    category?: string;
    difficulties?: RecipeDifficulty[];
    maxCookTimeMinutes?: number;
    servings?: number;
  };
  page?: number;
  limit?: number;
}

export async function getRecommendations(
  body: RecommendationRequest,
  accessToken?: string | null,
) {
  return requestApi<RecipeRecommendation[]>("/recommendations", {
    method: "POST",
    body: {
      filters: {},
      page: 1,
      limit: 12,
      ...body,
    },
    accessToken,
  });
}

export async function registerUser(input: {
  displayName?: string;
  email: string;
  password: string;
}) {
  return requestApi<AuthSession>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export async function loginUser(input: { email: string; password: string }) {
  return requestApi<AuthSession>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export async function logoutUser(refreshToken: string) {
  return requestApi<void>("/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}

export async function getMe(accessToken: string) {
  return requestApi<PublicUser>("/me", { accessToken });
}

export async function getSavedRecipes(accessToken: string) {
  return requestApi<SavedRecipe[]>("/me/saved-recipes", { accessToken });
}

export async function saveRecipe(slug: string, accessToken: string) {
  return requestApi<SavedRecipe>(`/me/saved-recipes/${slug}`, {
    method: "POST",
    accessToken,
  });
}

export async function removeSavedRecipe(slug: string, accessToken: string) {
  return requestApi<void>(`/me/saved-recipes/${slug}`, {
    method: "DELETE",
    accessToken,
  });
}

export async function startCookingSession(
  input: { recipeSlug: string; servings?: number },
  accessToken: string,
) {
  return requestApi<CookingSession>("/cooking-sessions", {
    method: "POST",
    body: input,
    accessToken,
  });
}

export async function updateCookingSession(
  id: string,
  input: { currentStep?: number; servings?: number },
  accessToken: string,
) {
  return requestApi<CookingSession>(`/cooking-sessions/${id}`, {
    method: "PATCH",
    body: input,
    accessToken,
  });
}

export async function completeCookingSession(id: string, accessToken: string) {
  return requestApi<CookingSession>(`/cooking-sessions/${id}/complete`, {
    method: "POST",
    accessToken,
  });
}

export async function submitCookingFeedback(
  id: string,
  input: { rating: number; issues: FeedbackIssue[]; note?: string },
  accessToken: string,
) {
  return requestApi<CookingFeedbackSummary>(`/cooking-sessions/${id}/feedback`, {
    method: "POST",
    body: input,
    accessToken,
  });
}

export async function getCookingHistory(
  accessToken: string,
  sort = "completed-at-desc",
) {
  return requestApi<CookingSession[]>(
    `/me/cooking-history?sort=${encodeURIComponent(sort)}`,
    { accessToken },
  );
}

export async function getPersonalization(accessToken: string) {
  return requestApi<PersonalizationInsight>("/me/personalization", {
    accessToken,
  });
}

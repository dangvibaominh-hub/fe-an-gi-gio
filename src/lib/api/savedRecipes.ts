import { apiDelete, apiGet, apiPost } from "@/lib/api/client";
import type { SavedRecipe } from "@/lib/types/savedRecipe";

export async function listSavedRecipes(
  accessToken: string,
): Promise<SavedRecipe[]> {
  const response = await apiGet<SavedRecipe[]>("/api/v1/me/saved-recipes", {
    accessToken,
    revalidate: false,
  });

  return response.data;
}

export async function saveRecipe(
  accessToken: string,
  recipeSlug: string,
): Promise<SavedRecipe> {
  const response = await apiPost<SavedRecipe, Record<string, never>>(
    `/api/v1/me/saved-recipes/${encodeURIComponent(recipeSlug)}`,
    {},
    accessToken,
  );

  return response.data;
}

export async function unsaveRecipe(
  accessToken: string,
  recipeSlug: string,
): Promise<void> {
  await apiDelete(
    `/api/v1/me/saved-recipes/${encodeURIComponent(recipeSlug)}`,
    accessToken,
  );
}

import type { RecipeSummary } from "@/lib/types/recipe";

export interface SavedRecipe extends RecipeSummary {
  savedAt: string;
}

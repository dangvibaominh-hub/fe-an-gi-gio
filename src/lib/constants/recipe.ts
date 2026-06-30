import type { RecipeDifficulty } from "@/lib/types/recipe";

export const RECIPE_CATEGORIES = [
  "Món xào",
  "Món canh",
  "Món chiên",
  "Món hấp",
  "Món chay",
  "Tráng miệng",
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export const DIFFICULTY_ORDER: Record<RecipeDifficulty, number> = {
  de: 0,
  "trung-binh": 1,
  kho: 2,
};

export const DEFAULT_RECIPE_LIST_LIMIT = 100;

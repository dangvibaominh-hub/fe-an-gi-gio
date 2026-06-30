import type { RecipeCategory } from "@/lib/constants/recipe";

export type RecipeDifficulty = "de" | "trung-binh" | "kho";
export type TechniqueIcon = "dao" | "chao" | "noi" | "tron" | "hap";

export interface RecipeSummary {
  baseServings: number;
  category: RecipeCategory;
  cookTimeMinutes: number;
  description: string;
  difficulty: RecipeDifficulty;
  id: string;
  image: string;
  imageAlt: string;
  slug: string;
  title: string;
}

export interface RecipeIngredient {
  baseAmount: number;
  haveIt: boolean;
  id: string;
  name: string;
  prepNote: string;
  unit: string;
}

export interface RecipeStep {
  content: string;
  estimatedMinutes: number;
  id: string;
  isTricky: boolean;
  techniqueIcon: TechniqueIcon;
  timerSeconds: number | null;
}

export interface RecipeDetail extends RecipeSummary {
  cookingTerms: Record<string, string>;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

import type { RecipeCategory } from "@/lib/constants/recipe";

export interface Category {
  id: string;
  name: RecipeCategory;
  slug: string;
}

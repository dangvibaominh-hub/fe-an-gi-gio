import type { Metadata } from "next";

import { SavedRecipesView } from "@/app/da-luu/SavedRecipesView";
import { listRecipes } from "@/lib/api/recipes";
import { DEFAULT_RECIPE_LIST_LIMIT } from "@/lib/constants/recipe";

export const metadata: Metadata = {
  title: "Công thức đã lưu",
};

export default async function SavedRecipesPage() {
  const { items: recipes } = await listRecipes({
    limit: DEFAULT_RECIPE_LIST_LIMIT,
  });

  return <SavedRecipesView recipes={recipes} />;
}

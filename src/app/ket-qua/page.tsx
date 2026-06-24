import type { Metadata } from "next";

import { RecipeCard } from "@/components/recipe/RecipeCard";
import { ResultsRecipeBrowser } from "@/components/recipe/ResultsRecipeBrowser";
import { EmptyState } from "@/components/ui/EmptyState";
import { listRecipes } from "@/lib/api/recipes";
import { DEFAULT_RECIPE_LIST_LIMIT } from "@/lib/constants/recipe";

export const metadata: Metadata = {
  title: "Kết quả công thức",
};

export default async function RecipeResultsPage() {
  const { items: recipes } = await listRecipes({
    limit: DEFAULT_RECIPE_LIST_LIMIT,
    sort: "difficulty-asc",
  });

  const filterableRecipes = recipes.map((recipe) => ({
    slug: recipe.slug,
    difficulty: recipe.difficulty,
    cookTimeMinutes: recipe.cookTimeMinutes,
    servings: recipe.baseServings,
    card: <RecipeCard key={recipe.slug} {...recipe} />,
  }));

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <ResultsRecipeBrowser
        recipes={filterableRecipes}
        emptyState={
          <EmptyState
            title="Không tìm thấy công thức phù hợp"
            description="Bạn thử xóa bớt bộ lọc hoặc chọn tiêu chí khác nhé."
          />
        }
      />
    </div>
  );
}

import type { Metadata } from "next";

import { CategoryTabs } from "@/components/recipe/CategoryTabs";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MOCK_RECIPES,
  RECIPE_CATEGORIES,
} from "@/lib/mockRecipes";

export const metadata: Metadata = {
  title: "Khám phá công thức",
};

export default function ExploreRecipesPage() {
  const panels = RECIPE_CATEGORIES.map((category) => {
    const recipes = MOCK_RECIPES.filter(
      (recipe) => recipe.category === category,
    );

    return {
      category,
      content:
        recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.slug} {...recipe} />
          ))
        ) : (
          <EmptyState
            title="Chưa có công thức phù hợp"
            description={`Danh mục ${category} đang được Phụ Bếp bổ sung. Bạn thử chọn một danh mục khác nhé.`}
          />
        ),
    };
  });

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <h1 className="sr-only">Khám phá công thức</h1>
      <CategoryTabs panels={panels} />
    </div>
  );
}

import type { Metadata } from "next";

import { CategoryTabs } from "@/components/recipe/CategoryTabs";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { listCategories } from "@/lib/api/categories";
import { listRecipes } from "@/lib/api/recipes";
import { DEFAULT_RECIPE_LIST_LIMIT } from "@/lib/constants/recipe";

export const metadata: Metadata = {
  title: "Khám phá công thức",
};

interface ExploreRecipesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ExploreRecipesPage({
  searchParams,
}: ExploreRecipesPageProps) {
  const resolvedSearchParams = await searchParams;
  const defaultCategory = resolvedSearchParams.category;

  const [{ items: recipes }, categories] = await Promise.all([
    listRecipes({ limit: DEFAULT_RECIPE_LIST_LIMIT }),
    listCategories(),
  ]);

  const panels = [
    {
      category: "Tất cả",
      content:
        recipes.length > 0 ? (
          recipes.map((recipe) => <RecipeCard key={recipe.slug} {...recipe} />)
        ) : (
          <EmptyState
            title="Chưa có công thức phù hợp"
            description="Phụ Bếp đang bổ sung thêm công thức. Bạn quay lại sau nhé."
          />
        ),
    },
    ...categories.map((category) => {
      const categoryRecipes = recipes.filter(
        (recipe) => recipe.category === category.name,
      );

      return {
        category: category.name,
        content:
          categoryRecipes.length > 0 ? (
            categoryRecipes.map((recipe) => (
              <RecipeCard key={recipe.slug} {...recipe} />
            ))
          ) : (
            <EmptyState
              title="Chưa có công thức phù hợp"
              description={`Danh mục ${category.name} đang được Phụ Bếp bổ sung. Bạn thử chọn một danh mục khác nhé.`}
            />
          ),
      };
    }),
  ] as const;

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <h1 className="sr-only">Khám phá công thức</h1>
      <CategoryTabs panels={panels} defaultCategory={defaultCategory} />
    </div>
  );
}

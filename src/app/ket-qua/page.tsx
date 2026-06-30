import type { Metadata } from "next";

import { RecipeCard } from "@/components/recipe/RecipeCard";
import { ResultsRecipeBrowser } from "@/components/recipe/ResultsRecipeBrowser";
import { SearchContextBanner } from "@/components/recipe/SearchContextBanner";
import { SearchSessionSync } from "@/components/home/SearchSessionSync";
import { EmptyState } from "@/components/ui/EmptyState";
import { recommendRecipes } from "@/lib/api/recommendations";
import { listRecipes } from "@/lib/api/recipes";
import { DEFAULT_RECIPE_LIST_LIMIT } from "@/lib/constants/recipe";
import {
  parseIngredientsFromSearchParams,
  type RecipeMatchMap,
} from "@/lib/searchSession";

export const metadata: Metadata = {
  title: "Kết quả công thức",
};

interface RecipeResultsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RecipeResultsPage({
  searchParams,
}: RecipeResultsPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchIngredients = parseIngredientsFromSearchParams(
    resolvedSearchParams,
  );
  const isSearchMode = searchIngredients.length > 0;

  if (isSearchMode) {
    const { items: recommendations, meta } = await recommendRecipes({
      ingredients: searchIngredients,
      limit: DEFAULT_RECIPE_LIST_LIMIT,
    });

    const matches: RecipeMatchMap = Object.fromEntries(
      recommendations.map((recipe) => [recipe.slug, recipe.match]),
    );

    const filterableRecipes = recommendations.map((recipe) => ({
      slug: recipe.slug,
      difficulty: recipe.difficulty,
      cookTimeMinutes: recipe.cookTimeMinutes,
      servings: recipe.baseServings,
      card: (
        <RecipeCard
          key={recipe.slug}
          {...recipe}
          match={recipe.match}
        />
      ),
    }));

    return (
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SearchSessionSync
          ingredients={searchIngredients}
          matches={matches}
        />
        <ResultsRecipeBrowser
          recipes={filterableRecipes}
          contextBanner={
            <SearchContextBanner
              ingredients={searchIngredients}
              source={meta.source}
            />
          }
          emptyState={
            <EmptyState
              title="Không tìm thấy công thức phù hợp"
              description="Bạn thử nhập nguyên liệu khác hoặc bớt danh sách hiện tại nhé."
            />
          }
          sortLabel="Độ khớp nguyên liệu"
        />
      </div>
    );
  }

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

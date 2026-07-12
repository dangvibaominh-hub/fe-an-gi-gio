import type { Metadata } from "next";

import { RecipeCard } from "@/components/recipe/RecipeCard";
import { ResultsRecipeBrowser } from "@/components/recipe/ResultsRecipeBrowser";
import { SearchContextBanner } from "@/components/recipe/SearchContextBanner";
import { UnknownIngredientsFallback } from "@/components/recipe/UnknownIngredientsFallback";
import { SearchSessionSync } from "@/components/home/SearchSessionSync";
import { EmptyState } from "@/components/ui/EmptyState";
import { ApiRequestError } from "@/lib/api/errors";
import { recommendRecipes } from "@/lib/api/recommendations";
import { listRecipes } from "@/lib/api/recipes";
import { DEFAULT_RECIPE_LIST_LIMIT } from "@/lib/constants/recipe";
import {
  parseIngredientsFromSearchParams,
  type RecipeMatchMap,
} from "@/lib/searchSession";
import type { RecipeDetail } from "@/lib/types/recipe";
import type { RecipeRecommendation } from "@/lib/types/recommendation";

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
    let recommendations;

    try {
      recommendations = await recommendRecipes({
        ingredients: searchIngredients,
        limit: DEFAULT_RECIPE_LIST_LIMIT,
      });
    } catch (error) {
      const unknownIngredients = getUnknownIngredients(error);

      if (unknownIngredients !== null) {
        return <UnknownIngredientsFallback ingredients={unknownIngredients} />;
      }

      throw error;
    }

    const { items, meta } = recommendations;

    const matches: RecipeMatchMap = Object.fromEntries(
      items.map((recipe) => [recipe.slug, recipe.match]),
    );

    const filterableRecipes = items.map((recipe) => ({
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
          generatedRecipes={
            meta.source === "gemini"
              ? items.filter(isRecipeDetail)
              : undefined
          }
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

function isRecipeDetail(
  recipe: RecipeRecommendation,
): recipe is RecipeRecommendation & RecipeDetail {
  return (
    Array.isArray(recipe.ingredients) &&
    Array.isArray(recipe.steps) &&
    typeof recipe.cookingTerms === "object" &&
    recipe.cookingTerms !== null
  );
}

function getUnknownIngredients(error: unknown): string[] | null {
  if (!(error instanceof ApiRequestError) || error.code !== "UNKNOWN_INGREDIENTS") {
    return null;
  }

  const unknownIngredients = (error.details as {
    unknownIngredients?: unknown;
  } | undefined)?.unknownIngredients;

  return Array.isArray(unknownIngredients) &&
      unknownIngredients.every((ingredient) => typeof ingredient === "string")
    ? unknownIngredients
    : null;
}

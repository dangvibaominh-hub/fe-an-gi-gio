import type { Metadata } from "next";

import { CategoryTabs } from "@/components/recipe/CategoryTabs";
import { ExploreRecipeFilters } from "@/components/recipe/ExploreRecipeFilters";
import { ExploreRecipePagination } from "@/components/recipe/ExploreRecipePagination";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { listCategories } from "@/lib/api/categories";
import { listRecipes, type RecipeSort } from "@/lib/api/recipes";
import type { RecipeDifficulty } from "@/lib/types/recipe";

export const metadata: Metadata = {
  title: "Khám phá công thức",
};

interface ExploreRecipesPageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string | string[];
    maxCookTimeMinutes?: string;
    page?: string;
    servings?: string;
    sort?: string;
  }>;
}

export default async function ExploreRecipesPage({
  searchParams,
}: ExploreRecipesPageProps) {
  const resolvedSearchParams = await searchParams;
  const defaultCategory = resolvedSearchParams.category;
  const difficulties = parseDifficulties(resolvedSearchParams.difficulty);
  const maxCookTimeMinutes = parsePositiveInteger(
    resolvedSearchParams.maxCookTimeMinutes,
  );
  const page = parsePositiveInteger(resolvedSearchParams.page) ?? 1;
  const servings = parsePositiveInteger(resolvedSearchParams.servings);
  const sort = parseRecipeSort(resolvedSearchParams.sort);

  const [{ items: recipes, meta }, categories] = await Promise.all([
    listRecipes({
      difficulties,
      limit: 12,
      maxCookTimeMinutes,
      page,
      servings,
      sort,
    }),
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
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 pt-4 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-terracotta sm:text-5xl lg:text-6xl">
          Món nên thử
        </h1>
        <p className="mt-3 text-sm text-charcoal/70 sm:text-base">
          Gợi ý những món phù hợp để bạn đổi vị mỗi ngày, từ dễ đến nâng cao.
        </p>
      </div>
      <h2 className="sr-only">Khám phá công thức</h2>
      <div className="mt-4">
        <ExploreRecipeFilters
          difficulties={difficulties}
          maxCookTimeMinutes={maxCookTimeMinutes}
          servings={servings}
          sort={sort}
        />
      </div>
      <div className="mt-7">
        <CategoryTabs panels={panels} defaultCategory={defaultCategory} />
      </div>
      <div className="mt-10">
        <ExploreRecipePagination page={meta.page} totalPages={meta.totalPages} />
      </div>
    </div>
  );
}

function parseDifficulties(
  value: string | string[] | undefined,
): RecipeDifficulty[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  const validDifficulties = new Set<RecipeDifficulty>([
    "de",
    "trung-binh",
    "kho",
  ]);

  return values.filter(
    (difficulty): difficulty is RecipeDifficulty =>
      validDifficulties.has(difficulty as RecipeDifficulty),
  );
}

function parsePositiveInteger(value: string | undefined) {
  if (!value) return undefined;

  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : undefined;
}

function parseRecipeSort(value: string | undefined): RecipeSort {
  return value === "cook-time-asc" || value === "newest"
    ? value
    : "difficulty-asc";
}

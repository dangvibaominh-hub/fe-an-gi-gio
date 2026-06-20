"use client";

import { useMemo, useState, type ReactNode } from "react";

import {
  FilterSidebar,
  type RecipeFilters,
  type ServingFilter,
  type TimeFilter,
} from "@/components/recipe/FilterSidebar";
import type { RecipeDifficulty } from "@/lib/mock-recipes";

export interface FilterableRecipe {
  card: ReactNode;
  cookTimeMinutes: number;
  difficulty: RecipeDifficulty;
  servings: number;
  slug: string;
}

export interface ResultsRecipeBrowserProps {
  emptyState: ReactNode;
  recipes: FilterableRecipe[];
}

const EMPTY_FILTERS: RecipeFilters = {
  difficulties: [],
  servings: [],
  times: [],
};

export function ResultsRecipeBrowser({
  emptyState,
  recipes,
}: ResultsRecipeBrowserProps) {
  const [filters, setFilters] = useState<RecipeFilters>(EMPTY_FILTERS);

  const filteredRecipes = useMemo(
    () =>
      recipes.filter(
        (recipe) =>
          matchesTime(recipe.cookTimeMinutes, filters.times) &&
          matchesServings(recipe.servings, filters.servings) &&
          (filters.difficulties.length === 0 ||
            filters.difficulties.includes(recipe.difficulty)),
      ),
    [filters, recipes],
  );

  function toggleFilter<T>(
    group: keyof RecipeFilters,
    value: T,
  ) {
    setFilters((currentFilters) => {
      const currentValues = currentFilters[group] as T[];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((currentValue) => currentValue !== value)
        : [...currentValues, value];

      return { ...currentFilters, [group]: nextValues };
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <div>
        <FilterSidebar
          filters={filters}
          onClear={() => setFilters(EMPTY_FILTERS)}
          onToggleDifficulty={(difficulty) =>
            toggleFilter("difficulties", difficulty)
          }
          onToggleServing={(serving) =>
            toggleFilter("servings", serving)
          }
          onToggleTime={(time) => toggleFilter("times", time)}
        />
      </div>

      <section aria-labelledby="results-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h1
            id="results-heading"
            className="text-3xl font-bold tracking-tight text-terracotta sm:text-4xl"
          >
            Kết quả công thức
          </h1>
          <p className="text-sm text-charcoal/65 sm:text-base">
            Sắp xếp: <strong className="text-charcoal">Dễ đến Khó</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredRecipes.length > 0
            ? filteredRecipes.map((recipe) => (
                <div key={recipe.slug}>{recipe.card}</div>
              ))
            : emptyState}
        </div>
      </section>
    </div>
  );
}

function matchesTime(
  cookTimeMinutes: number,
  filters: TimeFilter[],
) {
  if (filters.length === 0) {
    return true;
  }

  return filters.some((filter) => {
    if (filter === "duoi-30") {
      return cookTimeMinutes < 30;
    }

    if (filter === "30-60") {
      return cookTimeMinutes >= 30 && cookTimeMinutes <= 60;
    }

    return cookTimeMinutes > 60;
  });
}

function matchesServings(
  servings: number,
  filters: ServingFilter[],
) {
  if (filters.length === 0) {
    return true;
  }

  return filters.some((filter) => {
    if (filter === "1-2") {
      return servings <= 2;
    }

    if (filter === "3-4") {
      return servings >= 3 && servings <= 4;
    }

    return servings >= 5;
  });
}

"use client";

import { useEffect, useMemo, useState } from "react";

import { RecipeCard } from "@/components/recipe/RecipeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  RECIPE_CATEGORIES,
  type RecipeCategory,
} from "@/lib/constants/recipe";
import {
  SAVED_RECIPES_CHANGED_EVENT,
  getSavedRecipeSlugs,
} from "@/lib/savedRecipes";
import type { RecipeSummary } from "@/lib/types/recipe";

const SAVED_FILTERS = ["Tất cả", ...RECIPE_CATEGORIES] as const;

type SavedFilter = "Tất cả" | RecipeCategory;

export interface SavedRecipesViewProps {
  recipes: RecipeSummary[];
}

export function SavedRecipesView({ recipes }: SavedRecipesViewProps) {
  const [activeFilter, setActiveFilter] =
    useState<SavedFilter>("Tất cả");

  const [savedRecipeSlugs, setSavedRecipeSlugs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    function updateSavedRecipes() {
      setSavedRecipeSlugs(getSavedRecipeSlugs());
      setIsReady(true);
    }

    updateSavedRecipes();

    window.addEventListener(
      SAVED_RECIPES_CHANGED_EVENT,
      updateSavedRecipes,
    );

    window.addEventListener("storage", updateSavedRecipes);

    return () => {
      window.removeEventListener(
        SAVED_RECIPES_CHANGED_EVENT,
        updateSavedRecipes,
      );

      window.removeEventListener("storage", updateSavedRecipes);
    };
  }, []);

  const savedRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const isSaved = savedRecipeSlugs.includes(recipe.slug);

      const matchesCategory =
        activeFilter === "Tất cả" ||
        recipe.category === activeFilter;

      return isSaved && matchesCategory;
    });
  }, [activeFilter, recipes, savedRecipeSlugs]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#fff8ec]">
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div>
          <h1 className="text-4xl font-medium tracking-tight text-charcoal sm:text-5xl">
            Công thức đã lưu
          </h1>

          <p className="mt-3 text-sm text-charcoal/70 sm:text-base">
            Bộ sưu tập các món ăn yêu thích của bạn, sẵn sàng cho bữa ăn tiếp
            theo.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap gap-3">
          {SAVED_FILTERS.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "border-amber-400 bg-amber-400 text-charcoal"
                    : "border-terracotta/25 bg-white/50 text-charcoal hover:bg-white"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="mt-7">
          {!isReady ? (
            <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-terracotta/30 text-charcoal/70">
              Đang tải công thức...
            </div>
          ) : savedRecipes.length === 0 ? (
            <EmptyState
              title="Bạn chưa lưu công thức nào"
              description="Hãy vào Khám phá công thức và bấm biểu tượng bookmark để lưu món bạn thích."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {savedRecipes.map((recipe) => (
                <RecipeCard key={recipe.slug} {...recipe} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";

import { RecipeCard } from "@/components/recipe/RecipeCard";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  RECIPE_CATEGORIES,
  type RecipeCategory,
} from "@/lib/constants/recipe";

const SAVED_FILTERS = ["Tất cả", ...RECIPE_CATEGORIES] as const;

type SavedFilter = "Tất cả" | RecipeCategory;

export function SavedRecipesView() {
  const {
    isAuthenticated,
    isInitializing,
    openAuthModal,
    savedRecipes,
  } = useAuth();
  const [activeFilter, setActiveFilter] =
    useState<SavedFilter>("Tất cả");

  const filteredRecipes = useMemo(() => {
    return savedRecipes.filter((recipe) => {
      return (
        activeFilter === "Tất cả" || recipe.category === activeFilter
      );
    });
  }, [activeFilter, savedRecipes]);

  if (isInitializing) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#fff8ec]">
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-terracotta/30 text-charcoal/70">
            Đang tải công thức...
          </div>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#fff8ec]">
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-terracotta sm:text-5xl lg:text-6xl">
              Công thức đã lưu
            </h1>
            <p className="mt-3 text-sm text-charcoal/70 sm:text-base">
              Đăng nhập để đồng bộ công thức yêu thích trên mọi thiết bị.
            </p>
            <ButtonPrimary
              type="button"
              onClick={openAuthModal}
              className="mt-8"
            >
              Đăng nhập để xem công thức đã lưu
            </ButtonPrimary>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#fff8ec]">
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-terracotta sm:text-5xl lg:text-6xl">
            Công thức đã lưu
          </h1>

          <p className="mt-3 text-sm text-charcoal/70 sm:text-base">
            Bộ sưu tập các món ăn yêu thích của bạn, sẵn sàng cho bữa ăn tiếp
            theo.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Bộ lọc công thức đã lưu"
          className="mt-9 flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:gap-4"
        >
          {SAVED_FILTERS.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full border border-terracotta/20 px-5 py-2.5 text-sm font-semibold transition sm:px-6 sm:text-base ${"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  } ${isActive
                    ? "bg-mustard text-charcoal shadow-warm"
                    : "bg-terracotta/10 text-charcoal hover:bg-terracotta/15"
                  }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="mt-7">
          {filteredRecipes.length === 0 ? (
            <EmptyState
              title="Bạn chưa lưu công thức nào"
              description="Hãy vào Khám phá công thức và bấm biểu tượng bookmark để lưu món bạn thích."
            />
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.slug} {...recipe} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

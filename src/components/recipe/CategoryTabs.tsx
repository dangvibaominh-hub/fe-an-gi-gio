"use client";

import { useState, type ReactNode } from "react";

import type { RecipeCategory } from "@/lib/constants/recipe";

const ALL_CATEGORIES_TAB = "Tất cả" as const;

export interface CategoryPanel {
  category: RecipeCategory | typeof ALL_CATEGORIES_TAB;
  content: ReactNode;
}

export interface CategoryTabsProps {
  panels: readonly CategoryPanel[];
  defaultCategory?: string;
}

function getDefaultCategory(
  panels: readonly CategoryPanel[],
  defaultCategory?: string,
): CategoryPanel["category"] {
  if (!defaultCategory) {
    return ALL_CATEGORIES_TAB;
  }

  const matched = panels.find((panel) => panel.category === defaultCategory);

  return matched?.category ?? ALL_CATEGORIES_TAB;
}

export function CategoryTabs({ panels, defaultCategory }: CategoryTabsProps) {
  const defaultActiveCategory = getDefaultCategory(panels, defaultCategory);
  const [tabState, setTabState] = useState({
    activeCategory: defaultActiveCategory,
    defaultCategory,
  });

  if (tabState.defaultCategory !== defaultCategory) {
    setTabState({
      activeCategory: defaultActiveCategory,
      defaultCategory,
    });
  }

  const activeCategory =
    tabState.defaultCategory === defaultCategory
      ? tabState.activeCategory
      : defaultActiveCategory;

  const activePanel = panels.find(
    (panel) => panel.category === activeCategory,
  );

  const handleTabChange = (category: CategoryPanel["category"]) => {
    setTabState({
      activeCategory: category,
      defaultCategory,
    });

    if (typeof window === "undefined") {
      return;
    }

    if (category === ALL_CATEGORIES_TAB) {
      window.history.replaceState(null, "", "/kham-pha");
      return;
    }

    window.history.replaceState(
      null,
      "",
      `/kham-pha?category=${encodeURIComponent(category)}`,
    );
  };

  return (
    <>
      <div
        role="tablist"
        aria-label="Danh mục công thức"
        className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:gap-4"
      >
        {panels.map(({ category }) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(category)}
              className={[
                "shrink-0 rounded-full border border-terracotta/20 px-5 py-2.5 text-sm font-semibold transition sm:px-6 sm:text-base",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
                isActive
                  ? "bg-mustard text-charcoal shadow-warm"
                  : "bg-terracotta/10 text-charcoal hover:bg-terracotta/15",
              ].join(" ")}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4"
      >
        {activePanel?.content}
      </div>
    </>
  );
}

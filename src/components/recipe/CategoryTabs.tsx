"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import type { RecipeCategory } from "@/lib/constants/recipe";

export interface CategoryPanel {
  category: RecipeCategory;
  content: ReactNode;
}

export interface CategoryTabsProps {
  panels: CategoryPanel[];
  defaultCategory?: string;
}

export function CategoryTabs({ panels, defaultCategory }: CategoryTabsProps) {
  const router = useRouter();

  // Find the category that matches defaultCategory, or fallback to first category
  const getInitialCategory = (): RecipeCategory => {
    if (defaultCategory) {
      const matched = panels.find((panel) => panel.category === defaultCategory);
      if (matched) return matched.category;
    }
    return panels[0]?.category ?? "Món xào";
  };

  const [activeCategory, setActiveCategory] = useState<RecipeCategory>(getInitialCategory);

  // Sync activeCategory state if defaultCategory changes (e.g. browser navigation or clicking a link)
  useEffect(() => {
    if (defaultCategory) {
      const matched = panels.find((panel) => panel.category === defaultCategory);
      if (matched && matched.category !== activeCategory) {
        setActiveCategory(matched.category);
      }
    }
  }, [defaultCategory, panels, activeCategory]);

  const activePanel = panels.find(
    (panel) => panel.category === activeCategory,
  );

  const handleTabChange = (category: RecipeCategory) => {
    setActiveCategory(category);
    router.replace(`/kham-pha?category=${encodeURIComponent(category)}`, { scroll: false });
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
        className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {activePanel?.content}
      </div>
    </>
  );
}

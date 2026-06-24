"use client";

import { useState } from "react";

import { IngredientChecklist } from "@/components/recipe/IngredientChecklist";
import { ServingStepper } from "@/components/recipe/ServingStepper";
import type { RecipeIngredient } from "@/lib/types/recipe";

export interface RecipeIngredientsPanelProps {
  baseServings: number;
  ingredients: RecipeIngredient[];
}

export function RecipeIngredientsPanel({
  baseServings,
  ingredients,
}: RecipeIngredientsPanelProps) {
  const [servings, setServings] = useState(baseServings);

  return (
    <section
      aria-labelledby="ingredients-heading"
      className="rounded-2xl bg-white p-6 shadow-warm"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2
          id="ingredients-heading"
          className="text-2xl font-bold text-terracotta"
        >
          Khẩu phần
        </h2>
        <ServingStepper
          baseServings={baseServings}
          onServingsChange={setServings}
        />
      </div>
      <IngredientChecklist
        baseServings={baseServings}
        ingredients={ingredients}
        servings={servings}
      />
    </section>
  );
}

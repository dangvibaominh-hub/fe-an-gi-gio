"use client";

import { useState } from "react";

import type { RecipeIngredient } from "@/lib/types/recipe";

export interface IngredientChecklistProps {
  baseServings: number;
  ingredients: RecipeIngredient[];
  servings: number;
}

export function IngredientChecklist({
  baseServings,
  ingredients,
  servings,
}: IngredientChecklistProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      ingredients.map((ingredient) => [
        ingredient.id,
        ingredient.haveIt,
      ]),
    ),
  );

  const availableIngredients = ingredients.filter(
    (ingredient) => ingredient.haveIt,
  );
  const missingIngredients = ingredients.filter(
    (ingredient) => !ingredient.haveIt,
  );

  function toggleIngredient(id: string) {
    setCheckedIngredients((currentState) => ({
      ...currentState,
      [id]: !currentState[id],
    }));
  }

  return (
    <div className="mt-8 space-y-8">
      <IngredientGroup
        id="available"
        title="Bạn đã có"
        ingredients={availableIngredients}
        baseServings={baseServings}
        servings={servings}
        checkedIngredients={checkedIngredients}
        onToggle={toggleIngredient}
      />
      <IngredientGroup
        id="missing"
        title="Cần mua thêm"
        ingredients={missingIngredients}
        baseServings={baseServings}
        servings={servings}
        checkedIngredients={checkedIngredients}
        onToggle={toggleIngredient}
      />
    </div>
  );
}

interface IngredientGroupProps {
  baseServings: number;
  checkedIngredients: Record<string, boolean>;
  id: string;
  ingredients: RecipeIngredient[];
  onToggle: (id: string) => void;
  servings: number;
  title: string;
}

function IngredientGroup({
  baseServings,
  checkedIngredients,
  id,
  ingredients,
  onToggle,
  servings,
  title,
}: IngredientGroupProps) {
  return (
    <section aria-labelledby={`ingredient-group-${id}`}>
      <h3
        id={`ingredient-group-${id}`}
        className="border-b border-terracotta/20 pb-3 text-sm font-bold uppercase tracking-wide text-terracotta"
      >
        {title}
      </h3>
      <ul className="mt-2 divide-y divide-terracotta/10">
        {ingredients.map((ingredient) => {
          const isChecked = checkedIngredients[ingredient.id] ?? false;
          const scaledAmount =
            ingredient.baseAmount * (servings / baseServings);

          return (
            <li key={ingredient.id} className="py-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(ingredient.id)}
                  className="mt-1 size-5 shrink-0 rounded border-terracotta/30 accent-sage"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-4">
                    <span
                      className={
                        isChecked
                          ? "text-charcoal/55 line-through"
                          : "text-charcoal"
                      }
                    >
                      {ingredient.name}
                    </span>
                    <span className="shrink-0 font-semibold text-charcoal">
                      {formatAmount(scaledAmount)} {ingredient.unit}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-charcoal/55">
                    {ingredient.prepNote}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 2,
  }).format(amount);
}

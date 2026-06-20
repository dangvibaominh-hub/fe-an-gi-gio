"use client";

import { useState } from "react";

const INITIAL_INGREDIENTS = ["Thịt heo", "Cà rốt", "Nấm hương"];

export function IngredientPillInput() {
  const [ingredients, setIngredients] =
    useState<string[]>(INITIAL_INGREDIENTS);
  const [inputValue, setInputValue] = useState("");

  function addIngredient() {
    const nextIngredient = inputValue.trim();

    if (
      !nextIngredient ||
      ingredients.some(
        (ingredient) =>
          ingredient.toLocaleLowerCase("vi") ===
          nextIngredient.toLocaleLowerCase("vi"),
      )
    ) {
      setInputValue("");
      return;
    }

    setIngredients((currentIngredients) => [
      ...currentIngredients,
      nextIngredient,
    ]);
    setInputValue("");
  }

  function removeIngredient(ingredientToRemove: string) {
    setIngredients((currentIngredients) =>
      currentIngredients.filter(
        (ingredient) => ingredient !== ingredientToRemove,
      ),
    );
  }

  return (
    <div className="flex min-h-32 w-full flex-wrap content-start gap-3 rounded-3xl border border-terracotta/25 bg-white p-4 shadow-warm sm:p-5">
      <div className="flex min-w-0 flex-1 basis-full items-center gap-3">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-6 shrink-0 fill-none stroke-charcoal"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>

        <label htmlFor="ingredient-input" className="sr-only">
          Nhập nguyên liệu bạn đang có
        </label>
        <input
          id="ingredient-input"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (
              !event.nativeEvent.isComposing &&
              (event.key === "Enter" || event.key === ",")
            ) {
              event.preventDefault();
              addIngredient();
            }
          }}
          placeholder="Nhập nguyên liệu bạn đang có..."
          className="min-w-0 flex-1 bg-transparent text-base text-charcoal outline-none placeholder:text-charcoal/45 sm:text-lg"
        />
      </div>

      {ingredients.map((ingredient) => (
        <span
          key={ingredient}
          className="inline-flex items-center gap-2 rounded-full bg-sage/25 px-4 py-2 text-sm font-medium text-charcoal sm:text-base"
        >
          {ingredient}
          <button
            type="button"
            aria-label={`Xóa nguyên liệu ${ingredient}`}
            onClick={() => removeIngredient(ingredient)}
            className="inline-flex size-5 items-center justify-center rounded-full text-charcoal transition-colors hover:text-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <span aria-hidden="true">×</span>
          </button>
        </span>
      ))}
    </div>
  );
}

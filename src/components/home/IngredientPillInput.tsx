"use client";

import { useState } from "react";

const MAX_INGREDIENTS = 12;
const MAX_INGREDIENT_LENGTH = 24;

export interface IngredientPillInputProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onValidationError?: (message: string) => void;
}

export function IngredientPillInput({
  ingredients,
  onIngredientsChange,
  onValidationError,
}: IngredientPillInputProps) {
  const [inputValue, setInputValue] = useState("");

  function addIngredient() {
    const nextIngredient = inputValue.trim();

    if (!nextIngredient) {
      setInputValue("");
      return;
    }

    if (nextIngredient.length > MAX_INGREDIENT_LENGTH) {
      onValidationError?.(
        `Mỗi nguyên liệu tối đa ${MAX_INGREDIENT_LENGTH} ký tự.`,
      );
      return;
    }

    if (ingredients.length >= MAX_INGREDIENTS) {
      onValidationError?.(
        `Bạn chỉ có thể nhập tối đa ${MAX_INGREDIENTS} nguyên liệu.`,
      );
      return;
    }

    if (
      ingredients.some(
        (ingredient) =>
          ingredient.toLocaleLowerCase("vi") ===
          nextIngredient.toLocaleLowerCase("vi"),
      )
    ) {
      onValidationError?.("Nguyên liệu này đã có trong danh sách.");
      setInputValue("");
      return;
    }

    onIngredientsChange([...ingredients, nextIngredient]);
    setInputValue("");
  }

  function removeIngredient(ingredientToRemove: string) {
    onIngredientsChange(
      ingredients.filter(
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
          maxLength={MAX_INGREDIENT_LENGTH}
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

      <p className="basis-full text-xs text-charcoal/55 sm:text-sm">
        Tối đa {MAX_INGREDIENTS} nguyên liệu, mỗi nguyên liệu tối đa{" "}
        {MAX_INGREDIENT_LENGTH} ký tự.
      </p>

      {ingredients.map((ingredient) => (
        <span
          key={ingredient}
          className="inline-flex max-w-full items-center gap-2 rounded-full bg-sage/25 px-4 py-2 text-sm font-medium text-charcoal sm:text-base"
        >
          <span className="min-w-0 break-words">{ingredient}</span>
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

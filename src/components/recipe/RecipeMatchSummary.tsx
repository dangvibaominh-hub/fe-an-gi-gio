"use client";

import type { RecommendationMatch } from "@/lib/types/recommendation";

export interface RecipeMatchSummaryProps {
  match: RecommendationMatch;
}

export function RecipeMatchSummary({ match }: RecipeMatchSummaryProps) {
  const matchPercent = Math.round(match.score * 100);

  return (
    <div className="mt-3 space-y-2 border-t border-terracotta/15 pt-3">
      <p className="text-sm font-semibold text-sage">
        Khớp {matchPercent}% nguyên liệu
      </p>

      {match.matchedIngredients.length > 0 ? (
        <IngredientChipGroup
          label="Đã có"
          ingredients={match.matchedIngredients}
          tone="matched"
        />
      ) : null}

      {match.missingIngredients.length > 0 ? (
        <IngredientChipGroup
          label="Cần mua thêm"
          ingredients={match.missingIngredients}
          tone="missing"
        />
      ) : null}
    </div>
  );
}

interface IngredientChipGroupProps {
  ingredients: string[];
  label: string;
  tone: "matched" | "missing";
}

function IngredientChipGroup({
  ingredients,
  label,
  tone,
}: IngredientChipGroupProps) {
  const chipClassName =
    tone === "matched"
      ? "bg-sage/20 text-charcoal"
      : "bg-terracotta/10 text-terracotta";

  return (
    <div>
      <p className="text-xs font-medium text-charcoal/60">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {ingredients.map((ingredient) => (
          <span
            key={ingredient}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${chipClassName}`}
          >
            {ingredient}
          </span>
        ))}
      </div>
    </div>
  );
}

import type { RecipeDifficulty } from "@/lib/types/recipe";

export interface DifficultyBadgeProps {
  difficulty: RecipeDifficulty;
}

const DIFFICULTY_STYLES: Record<
  RecipeDifficulty,
  { className: string; label: string }
> = {
  de: {
    className: "bg-sage/15 text-charcoal",
    label: "Dễ",
  },
  "trung-binh": {
    className: "bg-mustard/15 text-charcoal",
    label: "Trung bình",
  },
  kho: {
    className: "bg-terracotta/15 text-terracotta",
    label: "Khó",
  },
};

export function DifficultyBadge({
  difficulty,
}: DifficultyBadgeProps) {
  const badge = DIFFICULTY_STYLES[difficulty];

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}

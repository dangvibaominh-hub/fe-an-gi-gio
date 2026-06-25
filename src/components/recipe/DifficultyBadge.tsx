import type { RecipeDifficulty } from "@/lib/types/recipe";

export interface DifficultyBadgeProps {
  difficulty: RecipeDifficulty;
  variant?: "default" | "overlay";
}

const DIFFICULTY_STYLES: Record<
  RecipeDifficulty,
  { className: string; label: string; overlayClassName: string }
> = {
  de: {
    className: "bg-sage/15 text-charcoal",
    label: "Dễ",
    overlayClassName: "bg-sage text-white shadow-warm",
  },
  "trung-binh": {
    className: "bg-mustard/15 text-charcoal",
    label: "Trung bình",
    overlayClassName: "bg-mustard text-charcoal shadow-warm",
  },
  kho: {
    className: "bg-terracotta/15 text-terracotta",
    label: "Khó",
    overlayClassName: "bg-terracotta text-white shadow-warm",
  },
};

export function DifficultyBadge({
  difficulty,
  variant = "default",
}: DifficultyBadgeProps) {
  const badge = DIFFICULTY_STYLES[difficulty];
  const styleClassName =
    variant === "overlay" ? badge.overlayClassName : badge.className;

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${styleClassName}`}
    >
      {badge.label}
    </span>
  );
}

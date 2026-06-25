import Image from "next/image";

import type { RecipeDifficulty } from "@/lib/types/recipe";

export interface DifficultyBadgeProps {
  difficulty: RecipeDifficulty;
  mode?: "badge" | "icon" | "text";
  variant?: "default" | "overlay";
}

const DIFFICULTY_STYLES: Record<
  RecipeDifficulty,
  {
    className: string;
    iconSrc: string;
    label: string;
    overlayClassName: string;
  }
> = {
  de: {
    className: "bg-sage/15 text-charcoal",
    iconSrc: "/images/icons/easy.png",
    label: "Dễ",
    overlayClassName: "bg-sage text-white shadow-warm",
  },
  "trung-binh": {
    className: "bg-mustard/15 text-charcoal",
    iconSrc: "/images/icons/medium.png",
    label: "Trung bình",
    overlayClassName: "bg-mustard text-charcoal shadow-warm",
  },
  kho: {
    className: "bg-terracotta/15 text-terracotta",
    iconSrc: "/images/icons/hard.png",
    label: "Khó",
    overlayClassName: "bg-terracotta text-white shadow-warm",
  },
};

export function DifficultyBadge({
  difficulty,
  mode = "badge",
  variant = "default",
}: DifficultyBadgeProps) {
  const badge = DIFFICULTY_STYLES[difficulty];
  const styleClassName =
    variant === "overlay" ? badge.overlayClassName : badge.className;

  if (mode === "icon") {
    return (
      <span
        className={`inline-flex size-14 shrink-0 items-center justify-center rounded-full ${styleClassName}`}
      >
        <Image
          src={badge.iconSrc}
          alt=""
          aria-hidden="true"
          width={30}
          height={30}
          className="size-9 rounded-full object-cover"
        />
      </span>
    );
  }

  if (mode === "text") {
    return (
      <span
        className={`inline-flex h-8 w-full items-center justify-center whitespace-nowrap rounded-full px-2.5 text-xs font-semibold leading-none ${styleClassName}`}
      >
        {badge.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styleClassName}`}
    >
      <Image
        src={badge.iconSrc}
        alt=""
        aria-hidden="true"
        width={10}
        height={10}
        className="size-3.5 rounded-full object-cover"
      />
      {badge.label}
    </span>
  );
}

import Image from "next/image";
import Link from "next/link";

import { BookmarkButton } from "@/components/recipe/BookmarkButton";
import { DifficultyBadge } from "@/components/recipe/DifficultyBadge";
import type { RecipeSummary } from "@/lib/types/recipe";

export type RecipeCardProps = RecipeSummary;

export function RecipeCard({
  cookTimeMinutes,
  difficulty,
  imageAlt,
  image,
  baseServings,
  slug,
  title,
}: RecipeCardProps) {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl bg-white shadow-warm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/cong-thuc/${slug}`}
        aria-label={`Xem công thức ${title}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
      />

      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <div className="absolute right-3 top-3 z-20">
          <BookmarkButton
            recipeSlug={slug}
            recipeTitle={title}
          />
        </div>
      </div>

      <div className="flex min-h-40 flex-col p-5">
        <h2 className="truncate text-xl font-semibold text-charcoal">
          {title}
        </h2>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-5 text-sm text-charcoal/75">
          <DifficultyBadge difficulty={difficulty} />

          <span className="inline-flex items-center gap-1.5">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4 fill-none stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {cookTimeMinutes} phút
          </span>

          <span className="inline-flex items-center gap-1.5">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4 fill-none stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="3" />
              <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            </svg>
            {baseServings} người
          </span>
        </div>
      </div>
    </article>
  );
}
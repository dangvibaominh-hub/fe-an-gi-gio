import Image from "next/image";
import Link from "next/link";

export interface CategoryCardProps {
  imageAlt: string;
  imageSrc: string;
  title: string;
  variant?: "responsive" | "loop";
}

export function CategoryCard({
  imageAlt,
  imageSrc,
  title,
  variant = "responsive",
}: CategoryCardProps) {
  const widthClassName =
    variant === "loop"
      ? "w-[230px] sm:w-[245px] lg:w-[265px]"
      : "w-[265px] sm:w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-2*1.25rem)/3)] lg:w-[calc((100%-3*1.25rem)/4)]";
  const shadowClassName =
    variant === "loop" ? "shadow-none hover:shadow-warm" : "shadow-warm hover:shadow-xl";

  return (
    <Link
      href={`/kham-pha?category=${encodeURIComponent(title)}`}
      aria-label={`Khám phá ${title}`}
      className={`group relative block aspect-[4/5] shrink-0 snap-start overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta ${widthClassName} ${shadowClassName}`}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent"
      />
      <span className="absolute inset-x-0 bottom-0 p-5 text-xl font-semibold text-white sm:text-2xl">
        {title}
      </span>
    </Link>
  );
}

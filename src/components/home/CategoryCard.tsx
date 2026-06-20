import Image from "next/image";
import Link from "next/link";

export interface CategoryCardProps {
  imageAlt: string;
  imageSrc: string;
  title: string;
}

export function CategoryCard({
  imageAlt,
  imageSrc,
  title,
}: CategoryCardProps) {
  return (
    <Link
      href="/kham-pha"
      aria-label={`Khám phá ${title}`}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-warm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
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

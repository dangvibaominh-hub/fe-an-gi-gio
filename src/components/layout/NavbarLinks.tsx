"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarLink {
  href: string;
  label: string;
}

export interface NavbarLinksProps {
  links: readonly NavbarLink[];
}

export function NavbarLinks({ links }: NavbarLinksProps) {
  const pathname = usePathname();

  return (
    <div className="hidden items-center gap-7 md:flex lg:gap-10">
      {links.map(({ href, label }) => {
        const isActive =
          href === "/" ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={[
              "relative py-2 text-sm text-charcoal transition-colors hover:text-terracotta focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta lg:text-base",
              isActive
                ? "font-bold after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-terracotta"
                : "font-medium",
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

import Link from "next/link";

import { ButtonSecondary } from "@/components/ui/ButtonSecondary";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ", isActive: true },
  { href: "/kham-pha", label: "Khám phá công thức", isActive: false },
  { href: "/lich-su", label: "Lịch sử nấu", isActive: false },
  { href: "/da-luu", label: "Công thức đã lưu", isActive: false },
] as const;

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-terracotta/20 bg-cream">
      <nav
        aria-label="Điều hướng chính"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight text-terracotta transition-opacity hover:opacity-80 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta sm:text-2xl"
        >
          Ăn Gì Giờ?
        </Link>

        <div className="hidden items-center gap-7 md:flex lg:gap-10">
          {NAV_LINKS.map(({ href, label, isActive }) => (
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
          ))}
        </div>

        <ButtonSecondary className="shrink-0 px-4 py-2 text-sm sm:px-6 sm:text-base">
          Đăng nhập
        </ButtonSecondary>
      </nav>
    </header>
  );
}

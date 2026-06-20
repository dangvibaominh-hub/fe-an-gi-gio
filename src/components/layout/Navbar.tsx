import Link from "next/link";

import { NavbarLinks } from "@/components/layout/NavbarLinks";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/kham-pha", label: "Khám phá công thức" },
  { href: "/lich-su", label: "Lịch sử nấu" },
  { href: "/da-luu", label: "Công thức đã lưu" },
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

        <NavbarLinks links={NAV_LINKS} />

        <ButtonSecondary className="shrink-0 px-4 py-2 text-sm sm:px-6 sm:text-base">
          Đăng nhập
        </ButtonSecondary>
      </nav>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Tổng quan", exact: true },
  { href: "/admin/cong-thuc", label: "Công thức" },
  { href: "/admin/kiem-duyet", label: "Kiểm duyệt AI" },
  { href: "/admin/tai-khoan", label: "Tài khoản" },
  { href: "/admin/nhat-ky", label: "Nhật ký" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Điều hướng quản trị"
      className="flex gap-2 overflow-x-auto rounded-2xl border border-terracotta/15 bg-white p-2 shadow-sm"
    >
      {links.map((link) => {
        const active = "exact" in link && link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              active
                ? "bg-terracotta text-white"
                : "text-charcoal/70 hover:bg-terracotta/10 hover:text-terracotta"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

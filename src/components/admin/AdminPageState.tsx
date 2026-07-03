import type { ReactNode } from "react";

export function AdminError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {message}
    </div>
  );
}

export function AdminEmpty({
  children,
  title,
}: {
  children?: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-terracotta/30 bg-white/60 p-10 text-center">
      <p className="font-semibold text-charcoal">{title}</p>
      {children}
    </div>
  );
}

export function AdminPagination({
  onPageChange,
  page,
  totalPages,
}: {
  onPageChange: (page: number) => void;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-5 flex items-center justify-end gap-3">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border border-terracotta/25 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
      >
        Trước
      </button>
      <span className="text-sm text-charcoal/65">
        Trang {page}/{totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl border border-terracotta/25 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
      >
        Sau
      </button>
    </div>
  );
}

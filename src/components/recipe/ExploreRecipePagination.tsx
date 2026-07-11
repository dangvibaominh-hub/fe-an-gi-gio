"use client";

import { useRouter, useSearchParams } from "next/navigation";

export interface ExploreRecipePaginationProps {
  page: number;
  totalPages: number;
}

export function ExploreRecipePagination({
  page,
  totalPages,
}: ExploreRecipePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const query = params.toString();
    router.replace(query ? `/kham-pha?${query}` : "/kham-pha");
  }

  return (
    <nav
      aria-label="Phân trang công thức"
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"
    >
      <button
        type="button"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        className="min-h-10 justify-self-start rounded-full border border-terracotta/25 bg-white px-4 text-sm font-semibold text-charcoal transition hover:border-terracotta disabled:cursor-not-allowed disabled:opacity-40"
      >
        Trước
      </button>

      <div className="flex flex-wrap justify-center gap-2" aria-label="Chọn trang">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => {
            const isCurrentPage = pageNumber === page;

            return (
              <button
                key={pageNumber}
                type="button"
                aria-current={isCurrentPage ? "page" : undefined}
                onClick={() => goToPage(pageNumber)}
                className={[
                  "inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
                  isCurrentPage
                    ? "bg-terracotta text-white"
                    : "border border-terracotta/25 bg-white text-charcoal hover:border-terracotta hover:text-terracotta",
                ].join(" ")}
              >
                {pageNumber}
              </button>
            );
          },
        )}
      </div>

      <button
        type="button"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className="min-h-10 justify-self-end rounded-full border border-terracotta/25 bg-white px-4 text-sm font-semibold text-charcoal transition hover:border-terracotta disabled:cursor-not-allowed disabled:opacity-40"
      >
        Sau
      </button>
    </nav>
  );
}

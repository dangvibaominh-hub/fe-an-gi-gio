import Link from "next/link";

import { ButtonPrimary } from "@/components/ui/ButtonPrimary";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-lg rounded-2xl border border-terracotta/20 bg-white/70 px-8 py-10 shadow-warm">
        <p className="text-sm font-semibold uppercase tracking-wide text-terracotta">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-charcoal sm:text-3xl">
          Không tìm thấy trang
        </h1>
        <p className="mt-3 text-charcoal/70">
          Công thức hoặc đường dẫn bạn chọn có thể đã bị gỡ hoặc chưa tồn
          tại.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonPrimary href="/">Về trang chủ</ButtonPrimary>
          <Link
            href="/kham-pha"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-terracotta/30 px-6 font-semibold text-charcoal transition hover:bg-terracotta/10"
          >
            Khám phá công thức
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

import { ButtonPrimary } from "@/components/ui/ButtonPrimary";

export interface UnknownIngredientsFallbackProps {
  ingredients: string[];
}

export function UnknownIngredientsFallback({
  ingredients,
}: UnknownIngredientsFallbackProps) {
  const ingredientList = new Intl.ListFormat("vi", {
    style: "long",
    type: "conjunction",
  }).format(ingredients);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <section className="w-full rounded-3xl border border-terracotta/20 bg-white p-7 text-center shadow-warm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">
          Chưa nhận diện được nguyên liệu
        </p>
        <h1 className="mt-3 text-2xl font-bold text-charcoal sm:text-3xl">
          Hãy thử lại với nguyên liệu quen thuộc hơn
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-charcoal/70">
          Chúng tôi chưa nhận diện được {ingredientList}. Bạn có thể kiểm tra
          chính tả hoặc thay bằng tên nguyên liệu cụ thể hơn.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonPrimary href="/">Nhập lại nguyên liệu</ButtonPrimary>
          <Link
            href="/kham-pha"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-terracotta/30 px-6 font-semibold text-charcoal transition hover:bg-terracotta/10"
          >
            Khám phá công thức
          </Link>
        </div>
      </section>
    </div>
  );
}

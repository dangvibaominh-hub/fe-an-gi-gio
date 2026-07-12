"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminError } from "@/components/admin/AdminPageState";
import { getAdminRecipe } from "@/lib/api/admin";
import type { AdminRecipeDetail, RecipeStatus } from "@/lib/types/admin";

const statusLabels: Record<RecipeStatus, string> = {
  DRAFT: "Bản nháp",
  HIDDEN: "Đã ẩn",
  PUBLISHED: "Đã xuất bản",
};

export function AdminRecipeDetailView({ recipeId }: { recipeId: string }) {
  const [recipe, setRecipe] = useState<AdminRecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getAdminRecipe(recipeId)
      .then((value) => { if (!cancelled) setRecipe(value); })
      .catch((reason: unknown) => { if (!cancelled) setError(reason instanceof Error ? reason.message : "Không thể tải công thức."); });
    return () => { cancelled = true; };
  }, [recipeId]);

  if (error) return <AdminError message={error} />;
  if (!recipe) return <div className="py-12 text-center text-charcoal/55">Đang tải công thức...</div>;

  return (
    <article className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/cong-thuc" className="text-sm font-semibold text-terracotta">← Danh sách công thức</Link>
          <h2 className="mt-2 text-3xl font-bold">{recipe.title}</h2>
          <p className="mt-2 text-charcoal/60">{recipe.description}</p>
        </div>
        <Link href={`/admin/cong-thuc/${recipe.id}/chinh-sua`} className="rounded-xl bg-terracotta px-5 py-3 font-semibold text-white">Chỉnh sửa</Link>
      </header>

      <section className="grid gap-6 rounded-2xl border border-terracotta/15 bg-white p-5 shadow-sm lg:grid-cols-[320px_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cream">
          <Image src={recipe.image} alt={recipe.imageAlt} fill unoptimized className="object-cover" />
        </div>
        <dl className="grid content-start gap-4 sm:grid-cols-2">
          <Info label="Trạng thái" value={statusLabels[recipe.status]} />
          <Info label="Danh mục" value={recipe.category.name} />
          <Info label="Độ khó" value={{ de: "Dễ", "trung-binh": "Trung bình", kho: "Khó" }[recipe.difficulty]} />
          <Info label="Thời gian" value={`${recipe.cookTimeMinutes} phút`} />
          <Info label="Khẩu phần" value={`${recipe.baseServings} người`} />
          <Info label="Slug tự động" value={recipe.slug} />
        </dl>
      </section>

      <section className="rounded-2xl border border-terracotta/15 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold">Nguyên liệu</h3>
        <ul className="mt-4 divide-y divide-terracotta/10">
          {recipe.ingredients.map((item) => <li key={item.id} className="flex justify-between gap-4 py-3"><span>{item.name}{item.prepNote ? ` (${item.prepNote})` : ""}</span><strong>{item.amount} {item.unit}</strong></li>)}
        </ul>
      </section>

      <section className="rounded-2xl border border-terracotta/15 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold">Các bước nấu</h3>
        <ol className="mt-4 space-y-4">
          {recipe.steps.map((step, index) => <li key={step.id} className="rounded-xl bg-cream/60 p-4"><strong>Bước {index + 1}</strong><p className="mt-1 leading-7">{step.content}</p><p className="mt-2 text-sm text-charcoal/55">Ước tính {step.estimatedMinutes} phút{step.timerSeconds ? ` · Hẹn giờ ${step.timerSeconds} giây` : ""}</p></li>)}
        </ol>
      </section>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm text-charcoal/55">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>;
}

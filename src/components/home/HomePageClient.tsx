"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CategoryCard } from "@/components/home/CategoryCard";
import { IngredientPillInput } from "@/components/home/IngredientPillInput";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { Toast } from "@/components/ui/Toast";
import {
  buildResultsHref,
  dedupeIngredients,
  readSearchIngredients,
  saveSearchSession,
} from "@/lib/searchSession";

const DEFAULT_INGREDIENTS = ["Thịt heo", "Cà rốt", "Nấm hương"];

const TODAY_SUGGESTIONS = ["Thịt kho tiêu", "Canh rau ngót", "Đậu hũ dồn thịt"];

const CATEGORIES = [
  {
    title: "Món xào",
    imageSrc: "/images/categories/mon-xao.png",
    imageAlt: "Đĩa mì xào rau xanh",
  },
  {
    title: "Món canh",
    imageSrc: "/images/categories/mon-canh.png",
    imageAlt: "Bát canh nóng với thịt và rau củ",
  },
  {
    title: "Món chiên",
    imageSrc: "/images/categories/mon-chien.png",
    imageAlt: "Đĩa chả giò chiên vàng",
  },
  {
    title: "Món hấp",
    imageSrc: "/images/categories/mon-hap.png",
    imageAlt: "Xửng bánh bao hấp nóng",
  },
] as const;

export function HomePageClient() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState(() => {
    const storedIngredients = readSearchIngredients();

    return storedIngredients.length > 0
      ? storedIngredients
      : DEFAULT_INGREDIENTS;
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setErrorMessage(null),
      2500,
    );

    return () => window.clearTimeout(timeoutId);
  }, [errorMessage]);

  function handleIngredientsChange(nextIngredients: string[]) {
    setIngredients(nextIngredients);
    saveSearchSession(nextIngredients);
  }

  function handleSearch() {
    const nextIngredients = dedupeIngredients(ingredients);

    if (nextIngredients.length === 0) {
      setErrorMessage("Hãy nhập ít nhất một nguyên liệu trước khi tìm món.");
      return;
    }

    setIsSearching(true);
    saveSearchSession(nextIngredients);
    router.push(buildResultsHref(nextIngredients));
  }

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-14">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-terracotta sm:text-5xl lg:text-6xl">
            Bạn đang có gì trong bếp?
          </h1>
          <div className="mt-8">
            <IngredientPillInput
              ingredients={ingredients}
              onIngredientsChange={handleIngredientsChange}
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="today-suggestions-heading"
        className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"
      >
        <h2
          id="today-suggestions-heading"
          className="text-base font-semibold text-charcoal"
        >
          Gợi ý hôm nay
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {TODAY_SUGGESTIONS.map((suggestion) => (
            <span
              key={suggestion}
              className="rounded-full bg-terracotta/10 px-5 py-2.5 text-sm font-semibold text-charcoal sm:text-base"
            >
              {suggestion}
            </span>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="categories-heading"
        className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8"
      >
        <h2
          id="categories-heading"
          className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl"
        >
          Khám phá theo cách chế biến
        </h2>
        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-7xl justify-center px-4 pb-20 sm:px-6 lg:px-8">
        <ButtonPrimary
          type="button"
          disabled={isSearching}
          onClick={handleSearch}
          className="min-w-56"
        >
          {isSearching ? "Đang chuyển trang..." : "Tìm món ngay"}
        </ButtonPrimary>
      </div>

      {errorMessage ? <Toast message={errorMessage} /> : null}
    </>
  );
}

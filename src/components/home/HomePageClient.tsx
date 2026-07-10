"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CategoryCard } from "@/components/home/CategoryCard";
import { IngredientPillInput } from "@/components/home/IngredientPillInput";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import LogoLoop from "@/components/ui/LogoLoop";
import RotatingText from "@/components/ui/RotatingText";
import { Toast } from "@/components/ui/Toast";
import {
  buildResultsHref,
  dedupeIngredients,
  readSearchIngredients,
  saveSearchSession,
} from "@/lib/searchSession";

const DEFAULT_INGREDIENTS = ["Cà rốt", "Rau muống", "Tỏi"];

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
  {
    title: "Món chay",
    imageSrc: "/images/categories/mon-chay.png",
    imageAlt: "Đĩa đậu hũ kho chay với rau củ",
  },
  {
    title: "Tráng miệng",
    imageSrc: "/images/categories/trang-mieng.png",
    imageAlt: "Ly chè ba màu nước cốt dừa thơm ngon",
  },
] as const;

export function HomePageClient() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const stored = readSearchIngredients();

      setIngredients(stored.length > 0 ? stored : DEFAULT_INGREDIENTS);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

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
    const nextIngredients = dedupeIngredients(ingredients ?? []);

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
          <h1 className="flex flex-wrap items-center gap-x-4 gap-y-3 text-4xl font-bold tracking-tight text-terracotta sm:text-5xl lg:text-6xl">
            <span>Hôm nay nấu với</span>
            <RotatingText
              texts={["trứng", "thịt bò", "rau muống", "cà chua"]}
              mainClassName="text-rotate-chip justify-center overflow-hidden rounded-2xl bg-terracotta px-4 py-1 text-white sm:px-5 sm:py-1.5"
              splitLevelClassName="overflow-hidden pb-1"
              animatePresenceMode="popLayout"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.018}
              transition={{
                type: "spring",
                damping: 36,
                stiffness: 280,
                mass: 0.85,
              }}
              rotationInterval={2000}
            />
          </h1>
          <div className="mt-8">
            {ingredients ? (
              <IngredientPillInput
                ingredients={ingredients}
                onIngredientsChange={handleIngredientsChange}
              />
            ) : (
              <div
                aria-hidden="true"
                className="min-h-32 rounded-3xl border border-terracotta/25 bg-white p-4 shadow-warm sm:p-5"
              />
            )}
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
        <div className="flex items-center justify-between">
          <h2
            id="categories-heading"
            className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl"
          >
            Khám phá theo cách chế biến
          </h2>
        </div>

        <div className="-mx-4 mt-7 h-[300px] overflow-hidden sm:mx-0 sm:h-[315px] lg:h-[340px]">
          <LogoLoop
            logos={CATEGORIES.map((category) => ({
              node: <CategoryCard {...category} variant="loop" />,
              title: category.title,
              ariaLabel: `Khám phá ${category.title}`,
            }))}
            speed={70}
            direction="left"
            logoHeight={1}
            gap={20}
            hoverSpeed={0}
            ariaLabel="Danh mục cách chế biến"
            className="category-card-loop"
          />
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

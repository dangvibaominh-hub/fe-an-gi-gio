"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const [ingredients, setIngredients] = useState(() => {
    const storedIngredients = readSearchIngredients();

    return storedIngredients.length > 0
      ? storedIngredients
      : DEFAULT_INGREDIENTS;
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  const checkScrollLimits = () => {
    const el = scrollRef.current;
    if (el) {
      setShowPrev(el.scrollLeft > 5);
      setShowNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScrollLimits();
      el.addEventListener("scroll", checkScrollLimits);
      window.addEventListener("resize", checkScrollLimits);
      return () => {
        el.removeEventListener("scroll", checkScrollLimits);
        window.removeEventListener("resize", checkScrollLimits);
      };
    }
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = el.clientWidth;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
        <div className="flex items-center justify-between">
          <h2
            id="categories-heading"
            className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl"
          >
            Khám phá theo cách chế biến
          </h2>
          {/* Navigation Controls */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              disabled={!showPrev}
              onClick={() => handleScroll("left")}
              aria-label="Danh mục trước"
              className="flex size-10 items-center justify-center rounded-full border border-terracotta/20 bg-white text-charcoal shadow-sm transition hover:bg-terracotta hover:text-white hover:shadow disabled:pointer-events-none disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              type="button"
              disabled={!showNext}
              onClick={() => handleScroll("right")}
              aria-label="Danh mục sau"
              className="flex size-10 items-center justify-center rounded-full border border-terracotta/20 bg-white text-charcoal shadow-sm transition hover:bg-terracotta hover:text-white hover:shadow disabled:pointer-events-none disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative mt-7">
          <div
            ref={scrollRef}
            className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scroll-smooth scrollbar-none sm:mx-0 sm:px-0"
          >
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>
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

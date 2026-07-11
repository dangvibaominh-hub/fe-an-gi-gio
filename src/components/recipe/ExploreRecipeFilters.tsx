"use client";

import { useRouter, useSearchParams } from "next/navigation";

import type { RecipeSort } from "@/lib/api/recipes";
import type { RecipeDifficulty } from "@/lib/types/recipe";

const DIFFICULTY_OPTIONS: ReadonlyArray<{
  label: string;
  value: RecipeDifficulty;
}> = [
    { label: "Dễ", value: "de" },
    { label: "Trung bình", value: "trung-binh" },
    { label: "Khó", value: "kho" },
  ];

const COOK_TIME_OPTIONS = [
  { label: "Mọi thời gian", value: "" },
  { label: "Tối đa 30 phút", value: "30" },
  { label: "Tối đa 60 phút", value: "60" },
  { label: "Tối đa 90 phút", value: "90" },
] as const;

const SERVING_OPTIONS = [
  { label: "Mọi khẩu phần", value: "" },
  { label: "1 người", value: "1" },
  { label: "2 người", value: "2" },
  { label: "4 người", value: "4" },
  { label: "6 người", value: "6" },
] as const;

const SORT_OPTIONS: ReadonlyArray<{ label: string; value: RecipeSort }> = [
  { label: "Độ khó: dễ đến khó", value: "difficulty-asc" },
  { label: "Thời gian nấu ngắn nhất", value: "cook-time-asc" },
  { label: "Mới nhất", value: "newest" },
];

export interface ExploreRecipeFiltersProps {
  difficulties: RecipeDifficulty[];
  maxCookTimeMinutes?: number;
  servings?: number;
  sort: RecipeSort;
}

export function ExploreRecipeFilters({
  difficulties,
  maxCookTimeMinutes,
  servings,
  sort,
}: ExploreRecipeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSearchParams(
    update: (params: URLSearchParams) => void,
  ) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    update(params);
    const query = params.toString();
    router.replace(query ? `/kham-pha?${query}` : "/kham-pha");
  }

  function toggleDifficulty(difficulty: RecipeDifficulty) {
    updateSearchParams((params) => {
      const nextDifficulties = difficulties.includes(difficulty)
        ? difficulties.filter((value) => value !== difficulty)
        : [...difficulties, difficulty];

      params.delete("difficulty");
      nextDifficulties.forEach((value) => params.append("difficulty", value));
    });
  }

  function clearFilters() {
    updateSearchParams((params) => {
      params.delete("difficulty");
      params.delete("maxCookTimeMinutes");
      params.delete("servings");
      params.delete("sort");
    });
  }

  const hasActiveFilters =
    difficulties.length > 0 ||
    maxCookTimeMinutes !== undefined ||
    servings !== undefined ||
    sort !== "difficulty-asc";

  return (
    <section
      aria-labelledby="explore-filters-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-1">
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-terracotta/30 bg-terracotta/10 px-4 py-2 text-sm font-semibold text-terracotta transition hover:bg-terracotta hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            Xóa bộ lọc
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_12rem_10rem_14rem] lg:items-end">
        <fieldset>
          <legend className="text-sm font-semibold text-charcoal">Độ khó</legend>
          <div className="mt-2 flex flex-col items-start gap-2">
            {DIFFICULTY_OPTIONS.map(({ label, value }) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 text-sm text-charcoal"
              >
                <input
                  type="checkbox"
                  checked={difficulties.includes(value)}
                  onChange={() => toggleDifficulty(value)}
                  className="size-4 rounded border-terracotta/30 accent-terracotta"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <FilterSelect
          label="Thời gian nấu"
          value={maxCookTimeMinutes?.toString() ?? ""}
          options={COOK_TIME_OPTIONS}
          onChange={(value) =>
            updateSearchParams((params) => {
              if (value) params.set("maxCookTimeMinutes", value);
              else params.delete("maxCookTimeMinutes");
            })
          }
        />

        <FilterSelect
          label="Khẩu phần"
          value={servings?.toString() ?? ""}
          options={SERVING_OPTIONS}
          onChange={(value) =>
            updateSearchParams((params) => {
              if (value) params.set("servings", value);
              else params.delete("servings");
            })
          }
        />

        <FilterSelect
          label="Sắp xếp"
          value={sort}
          options={SORT_OPTIONS}
          onChange={(value) =>
            updateSearchParams((params) => {
              if (value === "difficulty-asc") params.delete("sort");
              else params.set("sort", value);
            })
          }
        />
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-charcoal">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 rounded-xl border border-terracotta/30 bg-cream/30 px-3 font-medium text-charcoal outline-none focus:border-terracotta bg-white focus:ring-2 focus:ring-terracotta/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

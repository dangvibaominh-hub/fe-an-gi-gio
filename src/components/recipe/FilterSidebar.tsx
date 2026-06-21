"use client";

import type { ReactNode } from "react";

import type { RecipeDifficulty } from "@/lib/mockRecipes";

export type TimeFilter = "duoi-30" | "30-60" | "tren-60";
export type ServingFilter = "1-2" | "3-4" | "5-plus";

export interface RecipeFilters {
  difficulties: RecipeDifficulty[];
  servings: ServingFilter[];
  times: TimeFilter[];
}

export interface FilterSidebarProps {
  filters: RecipeFilters;
  onClear: () => void;
  onToggleDifficulty: (difficulty: RecipeDifficulty) => void;
  onToggleServing: (serving: ServingFilter) => void;
  onToggleTime: (time: TimeFilter) => void;
}

const TIME_OPTIONS: { label: string; value: TimeFilter }[] = [
  { label: "Dưới 30 phút", value: "duoi-30" },
  { label: "30 - 60 phút", value: "30-60" },
  { label: "Trên 60 phút", value: "tren-60" },
];

const SERVING_OPTIONS: { label: string; value: ServingFilter }[] = [
  { label: "1 - 2 người", value: "1-2" },
  { label: "3 - 4 người", value: "3-4" },
  { label: "5+ người", value: "5-plus" },
];

const DIFFICULTY_OPTIONS: {
  label: string;
  value: RecipeDifficulty;
}[] = [
  { label: "Dễ", value: "de" },
  { label: "Trung bình", value: "trung-binh" },
  { label: "Khó", value: "kho" },
];

export function FilterSidebar({
  filters,
  onClear,
  onToggleDifficulty,
  onToggleServing,
  onToggleTime,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.times.length > 0 ||
    filters.servings.length > 0 ||
    filters.difficulties.length > 0;

  return (
    <aside className="rounded-2xl border border-terracotta/20 bg-white p-6 shadow-warm lg:sticky lg:top-28">
      <h2 className="text-2xl font-bold text-charcoal">Bộ lọc</h2>

      <FilterGroup legend="Thời gian nấu">
        {TIME_OPTIONS.map((option) => (
          <FilterCheckbox
            key={option.value}
            checked={filters.times.includes(option.value)}
            label={option.label}
            onChange={() => onToggleTime(option.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Số người ăn">
        {SERVING_OPTIONS.map((option) => (
          <FilterCheckbox
            key={option.value}
            checked={filters.servings.includes(option.value)}
            label={option.label}
            onChange={() => onToggleServing(option.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Độ khó">
        {DIFFICULTY_OPTIONS.map((option) => (
          <FilterCheckbox
            key={option.value}
            checked={filters.difficulties.includes(option.value)}
            label={option.label}
            onChange={() => onToggleDifficulty(option.value)}
          />
        ))}
      </FilterGroup>

      {hasActiveFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 font-semibold text-terracotta underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          Xóa bộ lọc
        </button>
      ) : null}
    </aside>
  );
}

interface FilterGroupProps {
  children: ReactNode;
  legend: string;
}

function FilterGroup({ children, legend }: FilterGroupProps) {
  return (
    <fieldset className="mt-6">
      <legend className="font-semibold text-charcoal">{legend}</legend>
      <div className="mt-3 space-y-3">{children}</div>
    </fieldset>
  );
}

interface FilterCheckboxProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}

function FilterCheckbox({
  checked,
  label,
  onChange,
}: FilterCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-charcoal sm:text-base">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-5 rounded border-terracotta/30 accent-terracotta"
      />
      {label}
    </label>
  );
}

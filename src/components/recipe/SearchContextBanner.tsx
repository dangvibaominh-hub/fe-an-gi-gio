import type { RecommendationSource } from "@/lib/types/recommendation";

export interface SearchContextBannerProps {
  ingredients: string[];
  source: RecommendationSource;
}

const SOURCE_LABELS: Record<RecommendationSource, string> = {
  database: "từ kho công thức",
  gemini: "do Phụ Bếp gợi ý mới",
  empty: "chưa có món phù hợp",
};

export function SearchContextBanner({
  ingredients,
  source,
}: SearchContextBannerProps) {
  return (
    <div className="mb-6 rounded-2xl border border-terracotta/20 bg-white/70 p-5 shadow-warm">
      <p className="text-sm font-semibold text-charcoal">
        Đang tìm món cho nguyên liệu:
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {ingredients.map((ingredient) => (
          <span
            key={ingredient}
            className="rounded-full bg-sage/20 px-3 py-1.5 text-sm font-medium text-charcoal"
          >
            {ingredient}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm text-charcoal/65">
        Kết quả {SOURCE_LABELS[source]}.
      </p>
    </div>
  );
}

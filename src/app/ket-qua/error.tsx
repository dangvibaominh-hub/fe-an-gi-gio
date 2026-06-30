"use client";

import { ErrorState } from "@/components/ui/ErrorState";

interface RecipeResultsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RecipeResultsError({
  reset,
}: RecipeResultsErrorProps) {
  return (
    <ErrorState
      title="Không tải được kết quả"
      description="Hệ thống chưa thể gợi ý món lúc này. Bạn thử lại nhé."
      onRetry={reset}
    />
  );
}

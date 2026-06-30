"use client";

import { ErrorState } from "@/components/ui/ErrorState";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <ErrorState
      title="Đã xảy ra lỗi"
      description="Không thể tải trang lúc này. Bạn thử tải lại nhé."
      onRetry={reset}
    />
  );
}

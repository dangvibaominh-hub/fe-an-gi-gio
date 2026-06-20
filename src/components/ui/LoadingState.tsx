export interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Đang tìm món hợp với nguyên liệu của bạn...",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className="flex min-h-80 flex-col items-center justify-center px-6 text-center"
    >
      <div className="relative">
        <span className="absolute -top-7 left-5 h-6 w-1.5 animate-pulse rounded-full bg-mustard/60" />
        <span className="absolute -top-9 left-10 h-8 w-1.5 animate-pulse rounded-full bg-terracotta/50" />
        <span className="absolute -top-7 right-5 h-6 w-1.5 animate-pulse rounded-full bg-mustard/60" />
        <svg
          aria-hidden="true"
          viewBox="0 0 80 64"
          className="h-16 w-20 fill-none stroke-terracotta"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 24h52l-4 30H18l-4-30ZM8 31h7M65 31h7M28 16h24" />
          <path d="M34 10h12" />
        </svg>
      </div>
      <p className="mt-5 font-medium text-charcoal">{message}</p>
      <span className="sr-only">Đang tải</span>
    </div>
  );
}

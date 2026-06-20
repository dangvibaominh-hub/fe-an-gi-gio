export interface EmptyStateProps {
  description: string;
  title: string;
}

export function EmptyState({ description, title }: EmptyStateProps) {
  return (
    <div className="col-span-full flex min-h-72 flex-col items-center justify-center rounded-2xl border border-terracotta/20 bg-white/60 px-6 py-12 text-center shadow-warm">
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="size-16 fill-none stroke-terracotta"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 28h36l-3 24H17l-3-24Z" />
        <path d="M22 28c0-6 4-10 10-10s10 4 10 10M25 12c0-3 2-5 5-5M36 13c0-3 2-5 5-5" />
      </svg>
      <h2 className="mt-5 text-xl font-bold text-charcoal">{title}</h2>
      <p className="mt-2 max-w-md text-charcoal/65">{description}</p>
    </div>
  );
}

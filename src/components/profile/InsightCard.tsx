export interface InsightCardProps {
  message: string;
}

export function InsightCard({ message }: InsightCardProps) {
  return (
    <article className="flex gap-4 rounded-2xl border border-terracotta/15 bg-white p-5 shadow-warm">
      <span
        aria-hidden="true"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-terracotta/15 to-mustard/20 text-terracotta"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5 fill-none stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
        </svg>
      </span>
      <p className="text-sm leading-6 text-charcoal sm:text-base">{message}</p>
    </article>
  );
}

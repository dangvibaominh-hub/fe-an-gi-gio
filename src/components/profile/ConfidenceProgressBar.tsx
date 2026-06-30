interface ConfidenceProgressBarProps {
  confidence: number;
}

export function ConfidenceProgressBar({
  confidence,
}: ConfidenceProgressBarProps) {
  const percent = Math.round(Math.min(1, Math.max(0, confidence)) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-semibold text-charcoal">
          Mức độ tự tin nấu ăn của bạn
        </p>
        <span className="text-sm font-semibold text-charcoal/70">
          {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Mức độ tự tin nấu ăn: ${percent} phần trăm`}
        className="h-3 overflow-hidden rounded-full bg-terracotta/15"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-terracotta to-mustard transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-charcoal/65">
        Dựa trên {percent < 30 ? "ít" : "các"} phản hồi sau khi bạn nấu xong.
      </p>
    </div>
  );
}

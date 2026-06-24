"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCookingHistory } from "@/lib/api/cookingSessions";
import { ApiRequestError } from "@/lib/api/errors";
import { FEEDBACK_ISSUE_OPTIONS } from "@/lib/constants/feedback";
import { useAuth } from "@/lib/auth/AuthProvider";
import type {
  CookingHistorySort,
  CookingSession,
  FeedbackIssue,
} from "@/lib/types/cookingSession";

const HISTORY_SORT_OPTIONS: ReadonlyArray<{
  label: string;
  value: CookingHistorySort;
}> = [
  { label: "Gần đây nhất", value: "completed-at-desc" },
  { label: "Đánh giá cao nhất", value: "rating-desc" },
];

const ISSUE_LABELS = Object.fromEntries(
  FEEDBACK_ISSUE_OPTIONS.map(({ label, value }) => [value, label]),
) as Record<FeedbackIssue, string>;

export function CookingHistoryView() {
  const {
    isAuthenticated,
    isInitializing,
    openAuthModal,
  } = useAuth();
  const [sort, setSort] = useState<CookingHistorySort>("completed-at-desc");
  const [sessions, setSessions] = useState<CookingSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitializing || !isAuthenticated) {
      return;
    }

    let cancelled = false;

    async function loadHistory() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const { items } = await getCookingHistory({
          limit: 50,
          sort,
        });

        if (!cancelled) {
          setSessions(items);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof ApiRequestError) {
            setLoadError(error.message);
          } else {
            setLoadError("Không thể tải lịch sử nấu. Vui lòng thử lại.");
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isInitializing, sort]);

  const completedSessions = useMemo(() => {
    return sessions.filter((session) => session.status === "COMPLETED");
  }, [sessions]);

  if (isInitializing) {
    return (
      <HistoryPageShell>
        <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-terracotta/30 text-charcoal/70">
          Đang tải lịch sử...
        </div>
      </HistoryPageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <HistoryPageShell>
        <div className="max-w-2xl">
          <p className="mt-3 text-sm text-charcoal/70 sm:text-base">
            Đăng nhập để xem các món bạn đã nấu và đánh giá trước đó.
          </p>
          <ButtonPrimary
            type="button"
            onClick={openAuthModal}
            className="mt-8"
          >
            Đăng nhập để xem lịch sử
          </ButtonPrimary>
        </div>
      </HistoryPageShell>
    );
  }

  return (
    <HistoryPageShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-medium tracking-tight text-charcoal sm:text-5xl">
            Lịch sử nấu của bạn
          </h1>
          <p className="mt-3 text-sm text-charcoal/70 sm:text-base">
            Các món bạn đã hoàn thành và phản hồi gần đây.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-charcoal">
          Sắp xếp theo
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as CookingHistorySort)
            }
            className="min-h-11 rounded-xl border border-terracotta/30 bg-white px-4 py-2 font-medium text-charcoal outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          >
            {HISTORY_SORT_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-9">
        {isLoading ? (
          <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-terracotta/30 text-charcoal/70">
            Đang tải lịch sử...
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-terracotta/30 bg-white p-6 text-charcoal shadow-warm">
            <p>{loadError}</p>
          </div>
        ) : completedSessions.length === 0 ? (
          <EmptyState
            title="Bạn chưa hoàn thành món nào"
            description="Hãy chọn một công thức, bấm Bắt đầu nấu và hoàn thành từng bước để lưu lịch sử."
          />
        ) : (
          <ol className="relative space-y-8 border-l border-terracotta/20 pl-8">
            {completedSessions.map((session) => (
              <HistoryTimelineItem key={session.id} session={session} />
            ))}
          </ol>
        )}
      </div>
    </HistoryPageShell>
  );
}

function HistoryPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#fff8ec]">
      <section className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {children}
      </section>
    </main>
  );
}

function HistoryTimelineItem({ session }: { session: CookingSession }) {
  const completedDate = session.completedAt
    ? formatHistoryDate(session.completedAt)
    : formatHistoryDate(session.startedAt);

  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute -left-[2.35rem] top-6 size-4 rounded-full border-4 border-[#fff8ec] bg-terracotta"
      />

      <article className="overflow-hidden rounded-2xl bg-white shadow-warm">
        <div className="grid gap-4 p-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-start">
          <Link
            href={`/cong-thuc/${session.recipe.slug}`}
            className="relative block aspect-[4/3] overflow-hidden rounded-xl"
          >
            <Image
              src={session.recipe.image}
              alt={session.recipe.imageAlt}
              fill
              sizes="128px"
              className="object-cover"
            />
          </Link>

          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link
                  href={`/cong-thuc/${session.recipe.slug}`}
                  className="text-xl font-semibold text-charcoal transition hover:text-terracotta"
                >
                  {session.recipe.title}
                </Link>
                <p className="mt-1 text-sm text-charcoal/65">{completedDate}</p>
              </div>

              {session.feedback ? (
                <StarRating rating={session.feedback.rating} />
              ) : null}
            </div>

            {session.feedback?.issues.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {session.feedback.issues.map((issue) => (
                  <span
                    key={issue}
                    className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta"
                  >
                    {ISSUE_LABELS[issue]}
                  </span>
                ))}
              </div>
            ) : null}

            {session.feedback?.note ? (
              <p className="mt-4 text-sm leading-6 text-charcoal/75">
                “{session.feedback.note}”
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </li>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      aria-label={`Đánh giá ${rating} trên 5 sao`}
      className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1.5 text-sm font-semibold text-charcoal"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={index < rating ? "text-amber-500" : "text-charcoal/25"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function formatHistoryDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

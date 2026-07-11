"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCookingHistory } from "@/lib/api/cookingSessions";
import { getCookingFeedbackOptions } from "@/lib/api/feedback";
import { ApiRequestError } from "@/lib/api/errors";
import { resolveRecipeImage } from "@/lib/recipeImages";
import { FEEDBACK_ISSUE_OPTIONS } from "@/lib/constants/feedback";
import { normalizeCookingSession, normalizeFeedbackIssues } from "@/lib/cooking/normalize";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { PaginationMeta } from "@/lib/types/api";
import type {
  CookingHistorySort,
  CookingSession,
  FeedbackIssue,
} from "@/lib/types/cookingSession";

const HISTORY_SORT_OPTIONS: ReadonlyArray<{
  label: string;
  value: CookingHistorySort;
}> = [
  { label: "Nấu xong gần đây nhất", value: "completed-at-desc" },
  { label: "Bắt đầu nấu gần đây nhất", value: "started-at-desc" },
  { label: "Đánh giá cao nhất", value: "rating-desc" },
];
const HISTORY_PAGE_SIZE = 5;

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
  const [page, setPage] = useState(1);
  const [sessions, setSessions] = useState<CookingSession[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [issueLabelsBySession, setIssueLabelsBySession] = useState<
    Record<string, Partial<Record<FeedbackIssue, string>>>
  >({});
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
        const { items, meta } = await getCookingHistory({
          limit: HISTORY_PAGE_SIZE,
          page,
          sort,
        });

        if (!cancelled) {
          setSessions(items.map((session) => normalizeCookingSession(session)));
          setPagination(meta);
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
  }, [isAuthenticated, isInitializing, page, sort]);

  useEffect(() => {
    const sessionsWithFeedback = sessions.filter(
      (session) => normalizeFeedbackIssues(session.feedback?.issues).length > 0,
    );

    if (sessionsWithFeedback.length === 0) {
      return;
    }

    let cancelled = false;

    void Promise.all(
      sessionsWithFeedback.map(async (session) => {
        try {
          const options = await getCookingFeedbackOptions(session.id);
          return [
            session.id,
            Object.fromEntries(
              options.map(({ label, value }) => [value, label]),
            ) as Partial<Record<FeedbackIssue, string>>,
          ] as const;
        } catch {
          return [session.id, {}] as const;
        }
      }),
    ).then((entries) => {
      if (!cancelled) {
        setIssueLabelsBySession(Object.fromEntries(entries));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [sessions]);

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
          <h1 className="text-4xl font-bold tracking-tight text-terracotta sm:text-5xl lg:text-6xl">
            Lịch sử nấu
          </h1>
          <p className="mt-3 text-sm text-charcoal/70 sm:text-base">
            Các món bạn đã nấu xong gần đây.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-charcoal">
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as CookingHistorySort);
              setPage(1);
            }}
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
              <HistoryTimelineItem
                key={session.id}
                session={session}
                issueLabels={issueLabelsBySession[session.id]}
              />
            ))}
          </ol>
        )}

        {pagination && pagination.totalPages > 1 ? (
          <nav
            aria-label="Phân trang lịch sử nấu"
            className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3"
          >
            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage - 1)}
              disabled={pagination.page <= 1 || isLoading}
              className="min-h-10 justify-self-start rounded-full border border-terracotta/25 bg-white px-4 text-sm font-semibold text-charcoal transition hover:border-terracotta disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trước
            </button>
            <div className="flex flex-wrap justify-center gap-2" aria-label="Chọn trang">
              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1,
              ).map((pageNumber) => {
                const isCurrentPage = pageNumber === pagination.page;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    aria-current={isCurrentPage ? "page" : undefined}
                    disabled={isLoading}
                    onClick={() => setPage(pageNumber)}
                    className={[
                      "inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-not-allowed disabled:opacity-40",
                      isCurrentPage
                        ? "bg-terracotta text-white"
                        : "border border-terracotta/25 bg-white text-charcoal hover:border-terracotta hover:text-terracotta",
                    ].join(" ")}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage + 1)}
              disabled={
                pagination.page >= pagination.totalPages || isLoading
              }
              className="min-h-10 justify-self-end rounded-full border border-terracotta/25 bg-white px-4 text-sm font-semibold text-charcoal transition hover:border-terracotta disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau
            </button>
          </nav>
        ) : null}
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

function HistoryTimelineItem({
  session,
  issueLabels = {},
}: {
  issueLabels?: Partial<Record<FeedbackIssue, string>>;
  session: CookingSession;
}) {
  const completedDate = session.completedAt
    ? formatHistoryDate(session.completedAt)
    : formatHistoryDate(session.startedAt);
  const feedbackIssues = normalizeFeedbackIssues(session.feedback?.issues);

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
              src={resolveRecipeImage(session.recipe.image)}
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

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {feedbackIssues.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {feedbackIssues.map((issue) => (
                    <FeedbackIssueChip
                      key={issue}
                      label={issueLabels[issue] ?? ISSUE_LABELS[issue]}
                    />
                  ))}
                </div>
              ) : null}

              <ButtonPrimary
                href={`/cong-thuc/${session.recipe.slug}/nau`}
                className="ml-auto shrink-0 px-5 py-2.5 text-sm"
              >
                Bắt đầu nấu
              </ButtonPrimary>
            </div>

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

function FeedbackIssueChip({
  label,
}: {
  label?: string;
}) {
  if (!label) {
    return (
      <span
        aria-label="Đang tải nhãn phản hồi"
        className="h-7 w-28 animate-pulse rounded-full bg-terracotta/10"
      />
    );
  }

  return (
    <span className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta">
      {label}
    </span>
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

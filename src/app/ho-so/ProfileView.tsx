"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChefHat,
  Clock3,
  CookingPot,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";

import { InsightCard } from "@/components/profile/InsightCard";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { EmptyState } from "@/components/ui/EmptyState";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Toast } from "@/components/ui/Toast";
import { getPersonalization, updateProfile } from "@/lib/api/me";
import { ApiRequestError } from "@/lib/api/errors";
import { notifyAuthStateChanged } from "@/lib/auth/events";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  readStoredAuthSession,
  writeStoredAuthSession,
} from "@/lib/auth/tokenStore";
import type { PersonalizationInsight, ProfileTab } from "@/lib/types/personalization";

const PROFILE_TABS: ReadonlyArray<{
  href: string;
  id: ProfileTab;
  label: string;
}> = [
    { href: "/ho-so", id: "thong-tin", label: "Thông tin cá nhân" },
    {
      href: "/ho-so?tab=ca-nhan-hoa",
      id: "ca-nhan-hoa",
      label: "Cá nhân hóa",
    },
    { href: "/ho-so?tab=cai-dat", id: "cai-dat", label: "Cài đặt" },
  ];

const SIGNAL_DETAILS: ReadonlyArray<{
  description: string;
  icon: LucideIcon;
  key: keyof PersonalizationInsight["signals"];
  label: string;
}> = [
  { key: "preferEasyRecipes", label: "Công thức dễ thực hiện", description: "Ưu tiên các bước đơn giản, dễ theo dõi.", icon: ChefHat },
  { key: "preferQuickRecipes", label: "Món nấu nhanh", description: "Ưu tiên thời gian chuẩn bị và nấu ngắn hơn.", icon: Clock3 },
  { key: "preferIngredientFit", label: "Tận dụng nguyên liệu sẵn có", description: "Ưu tiên món phù hợp với nguyên liệu bạn có.", icon: PackageCheck },
  { key: "preferTechniqueGuidance", label: "Hướng dẫn kỹ thuật rõ ràng", description: "Bổ sung mẹo và hướng dẫn thao tác chi tiết hơn.", icon: CookingPot },
  ];

const ISSUE_LABELS: Readonly<Record<string, string>> = {
  "cutting-meat-hard": "Cắt thịt khó",
  "hard-to-follow-steps": "Khó theo dõi các bước",
  "ingredients-overcooked": "Nguyên liệu bị quá chín",
  "missing-ingredients": "Thiếu nguyên liệu",
  "oil-splatter": "Chiên bị bắn dầu",
  "pan-sticking-or-burning": "Chảo bị dính hoặc cháy",
  "taste-not-right": "Hương vị chưa đúng ý",
  "took-longer-than-expected": "Mất nhiều thời gian hơn dự kiến",
};

export function ProfileView() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = resolveProfileTab(tabParam);

  const {
    isAuthenticated,
    isInitializing,
    openAuthModal,
    user,
  } = useAuth();

  if (isInitializing) {
    return (
      <ProfilePageShell>
        <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-terracotta/30 text-charcoal/70">
          Đang tải hồ sơ...
        </div>
      </ProfilePageShell>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <ProfilePageShell>
        <div className="max-w-2xl">
          <h1 className="text-4xl font-medium tracking-tight text-charcoal sm:text-5xl">
            Hồ sơ của bạn
          </h1>
          <p className="mt-3 text-sm text-charcoal/70 sm:text-base">
            Đăng nhập để xem và chỉnh sửa thông tin cá nhân, cá nhân hóa.
          </p>
          <ButtonPrimary
            type="button"
            onClick={openAuthModal}
            className="mt-8"
          >
            Đăng nhập để xem hồ sơ
          </ButtonPrimary>
        </div>
      </ProfilePageShell>
    );
  }

  return (
    <ProfilePageShell>
      <h1 className="text-4xl font-bold tracking-tight text-terracotta sm:text-5xl lg:text-6xl">
        Hồ sơ của bạn
      </h1>
      <p className="mt-3 text-sm text-charcoal/70 sm:text-base">
        Quản lý thông tin tài khoản và xem cách Ăn Gì Giờ? học từ phản hồi của
        bạn.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
        <nav
          aria-label="Mục hồ sơ"
          className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
        >
          {PROFILE_TABS.map(({ href, id, label }) => {
            const isActive = activeTab === id;

            return (
              <Link
                key={id}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta lg:text-base",
                  isActive
                    ? "bg-terracotta text-white shadow-warm"
                    : "bg-white/70 text-charcoal hover:bg-white hover:text-terracotta",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-2xl bg-white p-6 shadow-warm sm:p-8">
          {activeTab === "thong-tin" ? (
            <ProfileInfoPanel key={user.displayName} user={user} />
          ) : null}
          {activeTab === "ca-nhan-hoa" ? <PersonalizationPanel /> : null}
          {activeTab === "cai-dat" ? <SettingsPanel /> : null}
        </div>
      </div>
    </ProfilePageShell>
  );
}

function ProfilePageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#fff8ec]">
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {children}
      </section>
    </main>
  );
}

interface ProfileInfoPanelProps {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}

function ProfileInfoPanel({ user }: ProfileInfoPanelProps) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(null), 2500);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setErrorMessage("Vui lòng nhập tên hiển thị.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const updatedUser = await updateProfile({ displayName: trimmedName });
      const storedSession = readStoredAuthSession();

      if (storedSession) {
        writeStoredAuthSession({
          tokens: {
            accessToken: storedSession.accessToken,
            expiresIn: 900,
            refreshToken: storedSession.refreshToken,
            tokenType: "Bearer",
          },
          user: updatedUser,
        });
      }

      notifyAuthStateChanged();
      setToastMessage("Đã cập nhật hồ sơ");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-charcoal">Thông tin cá nhân</h2>
      <p className="mt-2 text-sm text-charcoal/70">
        Cập nhật tên hiển thị trên tài khoản của bạn.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="profile-display-name" className="font-semibold text-charcoal">
            Tên hiển thị
          </label>
          <input
            id="profile-display-name"
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value);
              setErrorMessage(null);
            }}
            autoComplete="name"
            maxLength={120}
            className="mt-2 min-h-12 w-full rounded-xl border border-terracotta/30 bg-cream/40 px-4 py-3 text-charcoal outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
          />
        </div>

        <div>
          <label htmlFor="profile-email" className="font-semibold text-charcoal">
            Email
          </label>
          <input
            id="profile-email"
            value={user.email}
            readOnly
            className="mt-2 min-h-12 w-full rounded-xl border border-terracotta/20 bg-charcoal/5 px-4 py-3 text-charcoal/70"
          />
          <p className="mt-1.5 text-sm text-charcoal/60">
            Email không thể thay đổi tại đây.
          </p>
        </div>

        {errorMessage ? (
          <p className="text-sm text-terracotta" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <ButtonPrimary type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </ButtonPrimary>
      </form>

      {toastMessage ? <Toast message={toastMessage} /> : null}
    </>
  );
}

function PersonalizationPanel() {
  const [insight, setInsight] = useState<PersonalizationInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPersonalization() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const data = await getPersonalization();

        if (!cancelled) {
          setInsight(data);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof ApiRequestError) {
            setLoadError(error.message);
          } else {
            setLoadError("Không thể tải dữ liệu cá nhân hóa.");
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPersonalization();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleInsights = (insight?.insights ?? []).slice(0, 3);
  const activeSignals = insight
    ? SIGNAL_DETAILS.filter(({ key }) => insight.signals[key] > 0)
    : [];
  const recurringIssues = insight
    ? Object.entries(insight.issueCounts)
      .filter(([, count]) => count > 0)
      .sort(([, leftCount], [, rightCount]) => rightCount - leftCount)
      .slice(0, 3)
    : [];

  return (
    <>
      <h2 className="text-2xl font-bold text-charcoal">Cá nhân hóa</h2>
      <div className="mt-8">
        {isLoading ? (
          <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-terracotta/30 text-charcoal/70">
            Đang tải cá nhân hóa...
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-terracotta/30 bg-cream/40 p-5 text-charcoal">
            {loadError}
          </div>
        ) : !insight || insight.feedbackCount === 0 ? (
          <EmptyState
            title="Chưa có dữ liệu cá nhân hóa"
            description="Hoàn thành một món và gửi đánh giá để hệ thống bắt đầu học sở thích của bạn."
          />
        ) : (
          <div className="space-y-8">
            <section className="overflow-hidden rounded-2xl border border-terracotta/20 bg-white p-6 text-terracotta shadow-warm sm:p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta/70">
                Hồ sơ gợi ý của bạn
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                Ăn Gì Giờ? đang học từ những lần bạn nấu.
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/70 sm:text-base">
                Mỗi feedback giúp công thức và hướng dẫn lần sau phù hợp với bạn hơn.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <PersonalizationStat label="Feedback đã gửi" value={String(insight.feedbackCount)} />
                <PersonalizationStat label="Điểm trung bình" value={insight.averageRating > 0 ? `${insight.averageRating.toFixed(1)} / 5` : "Chưa có"} />
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-charcoal">
                Điều hệ thống đang ưu tiên
              </h3>
              <p className="mt-1 text-sm text-charcoal/65">
                Những thay đổi sẽ ảnh hưởng đến gợi ý món và cách hướng dẫn.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {activeSignals.length > 0 ? (
                  activeSignals.map(({ description, icon: Icon, key, label }) => (
                    <SpotlightCard
                      key={key}
                      spotlightColor="rgba(116, 155, 120, 0.28)"
                      className="rounded-2xl border border-sage/30 bg-sage/10 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-sage/25 text-charcoal">
                          <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
                        </span>
                        <div>
                          <p className="font-semibold text-charcoal">{label}</p>
                          <p className="mt-1 text-sm leading-6 text-charcoal/70">{description}</p>
                        </div>
                      </div>
                    </SpotlightCard>
                  ))
                ) : (
                  <SpotlightCard
                    spotlightColor="rgba(209, 103, 75, 0.16)"
                    className="rounded-2xl border border-dashed border-terracotta/30 bg-white/70 p-5 sm:col-span-2"
                  >
                    <p className="font-semibold text-charcoal">Chưa có sở thích nổi bật</p>
                    <p className="mt-1 text-sm leading-6 text-charcoal/70">
                      Bạn đã gửi đánh giá, nhưng chưa có một xu hướng đủ rõ để ưu tiên. Hãy chọn các thẻ phản hồi cụ thể khi đánh giá để gợi ý thay đổi rõ rệt hơn.
                    </p>
                  </SpotlightCard>
                )}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-charcoal">Điều chỉnh gần đây</h3>
                <div className="mt-4 space-y-4">
                  {visibleInsights.length > 0 ? (
                    visibleInsights.map((message) => <InsightCard key={message} message={message} />)
                  ) : (
                    <SpotlightCard
                      spotlightColor="rgba(209, 103, 75, 0.16)"
                      className="rounded-2xl border border-dashed border-terracotta/30 p-5 text-sm leading-6 text-charcoal/70"
                    >
                      Chưa có điều chỉnh cụ thể. Các gợi ý sẽ xuất hiện ở đây khi hệ thống nhận thấy một xu hướng rõ ràng.
                    </SpotlightCard>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-charcoal">Điểm cần lưu ý khi nấu</h3>
                <SpotlightCard
                  spotlightColor="rgba(209, 103, 75, 0.14)"
                  className="mt-4 rounded-2xl bg-cream/50 p-5"
                >
                  {recurringIssues.length > 0 ? (
                    <ul className="space-y-3">
                      {recurringIssues.map(([issue, count]) => (
                        <li key={issue} className="flex items-center justify-between gap-3 text-sm text-charcoal">
                          <span>{ISSUE_LABELS[issue] ?? issue}</span>
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-terracotta">{count} lần</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-6 text-charcoal/70">
                      Chưa có vấn đề nào lặp lại trong phản hồi của bạn. Đây là tín hiệu tích cực — hãy tiếp tục đánh giá để hệ thống hiểu rõ hơn.
                    </p>
                  )}
                </SpotlightCard>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
}

function PersonalizationStat({ label, value }: { label: string; value: string }) {
  return (
    <SpotlightCard
      spotlightColor="rgba(209, 103, 75, 0.18)"
      className="rounded-xl border border-terracotta/20 bg-terracotta/5 px-4 py-3"
    >
      <p className="text-xs font-medium text-charcoal/65">{label}</p>
      <p className="mt-1 text-xl font-bold text-terracotta">{value}</p>
    </SpotlightCard>
  );
}

function SettingsPanel() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await logout();
      router.push("/");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-charcoal">Cài đặt</h2>
      <p className="mt-2 text-sm text-charcoal/70">
        Quản lý phiên đăng nhập và tài khoản.
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-terracotta/15 bg-cream/40 p-5">
          <p className="text-sm font-semibold text-charcoal">Tài khoản</p>
          <p className="mt-1 text-sm text-charcoal/70">{user?.email}</p>
          <p className="mt-1 text-sm text-charcoal/70">
            Vai trò: {user?.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
          </p>
        </div>

        <ButtonSecondary
          type="button"
          disabled={isSigningOut}
          onClick={() => {
            void handleSignOut();
          }}
          className="w-full sm:w-auto"
        >
          {isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}
        </ButtonSecondary>
      </div>
    </>
  );
}

function resolveProfileTab(tabParam: string | null): ProfileTab {
  if (tabParam === "ca-nhan-hoa" || tabParam === "cai-dat") {
    return tabParam;
  }

  return "thong-tin";
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ConfidenceProgressBar } from "@/components/profile/ConfidenceProgressBar";
import { InsightCard } from "@/components/profile/InsightCard";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { EmptyState } from "@/components/ui/EmptyState";
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
      <h1 className="text-4xl font-medium tracking-tight text-charcoal sm:text-5xl">
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
      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
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

  return (
    <>
      <h2 className="text-2xl font-bold text-charcoal">Cá nhân hóa</h2>
      <p className="mt-2 text-sm text-charcoal/70">
        Ăn Gì Giờ? học từ đánh giá sau mỗi lần nấu để gợi ý phù hợp hơn.
      </p>

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
            <ConfidenceProgressBar confidence={insight.confidence} />

            <div>
              <h3 className="text-lg font-semibold text-charcoal">
                Điều chỉnh gần đây
              </h3>
              <div className="mt-4 space-y-4">
                {visibleInsights.length > 0 ? (
                  visibleInsights.map((message) => (
                    <InsightCard key={message} message={message} />
                  ))
                ) : (
                  <p className="text-sm text-charcoal/70">
                    Tiếp tục nấu và đánh giá để nhận thêm gợi ý cá nhân hóa.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-cream/50 p-5 text-sm text-charcoal/75">
              <p>
                Đã nhận <strong>{insight.feedbackCount}</strong> đánh giá
                {insight.averageRating > 0
                  ? ` · Trung bình ${insight.averageRating.toFixed(1)} sao`
                  : ""}
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </>
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

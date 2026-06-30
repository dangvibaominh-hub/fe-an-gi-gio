"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CookingProgressBar } from "@/components/cooking/CookingProgressBar";
import { CookingStepContent } from "@/components/cooking/CookingStepContent";
import { CookingTimerPanel } from "@/components/cooking/CookingTimerPanel";
import { StepNavigationButtons } from "@/components/cooking/StepNavigationButtons";
import { FeedbackModal } from "@/components/modals/FeedbackModal";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  completeCookingSession,
  startCookingSession,
  updateCookingSession,
} from "@/lib/api/cookingSessions";
import { ApiRequestError } from "@/lib/api/errors";
import {
  POST_COOKING_TOAST_KEY,
  POST_COOKING_TOAST_MESSAGE,
} from "@/lib/constants/feedback";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { CookingSession } from "@/lib/types/cookingSession";
import type { RecipeDetail } from "@/lib/types/recipe";

export interface CookingModeViewProps {
  recipe: RecipeDetail;
}

export function CookingModeView({ recipe }: CookingModeViewProps) {
  const router = useRouter();
  const {
    isAuthenticated,
    isInitializing,
    openAuthModal,
    requireAuth,
  } = useAuth();

  const [session, setSession] = useState<CookingSession | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const totalSteps = recipe.steps.length;
  const currentStepNumber = session?.currentStep ?? 1;
  const currentStepIndex = Math.min(
    Math.max(currentStepNumber - 1, 0),
    Math.max(totalSteps - 1, 0),
  );
  const currentStep = recipe.steps[currentStepIndex];
  const isLastStep = currentStepNumber >= totalSteps;

  const initializeSession = async () => {
    setIsLoadingSession(true);
    setLoadError(null);

    try {
      const nextSession = await startCookingSession({
        recipeSlug: recipe.slug,
        servings: recipe.baseServings,
      });

      setSession(nextSession);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setLoadError(error.message);
      } else {
        setLoadError("Không thể bắt đầu phiên nấu. Vui lòng thử lại.");
      }
    } finally {
      setIsLoadingSession(false);
    }
  };

  useEffect(() => {
    if (isInitializing || !isAuthenticated) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoadingSession(true);
      setLoadError(null);

      try {
        const nextSession = await startCookingSession({
          recipeSlug: recipe.slug,
          servings: recipe.baseServings,
        });

        if (!cancelled) {
          setSession(nextSession);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof ApiRequestError) {
            setLoadError(error.message);
          } else {
            setLoadError("Không thể bắt đầu phiên nấu. Vui lòng thử lại.");
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSession(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isInitializing, recipe.baseServings, recipe.slug]);

  async function persistStep(nextStep: number) {
    if (!session) {
      return;
    }

    const updatedSession = await updateCookingSession(session.id, {
      currentStep: nextStep,
    });

    setSession(updatedSession);
  }

  async function handleBack() {
    if (!session || currentStepNumber <= 1) {
      return;
    }

    setActionError(null);

    try {
      await persistStep(currentStepNumber - 1);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setActionError(error.message);
      } else {
        setActionError("Không thể lưu tiến độ. Vui lòng thử lại.");
      }
    }
  }

  async function handleForward() {
    if (!session) {
      return;
    }

    setActionError(null);

    try {
      if (isLastStep) {
        setIsCompleting(true);
        const completedSession = await completeCookingSession(session.id);
        setSession(completedSession);
        setIsFeedbackOpen(true);
        return;
      }

      await persistStep(currentStepNumber + 1);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setActionError(error.message);
      } else {
        setActionError("Không thể lưu tiến độ. Vui lòng thử lại.");
      }
    } finally {
      setIsCompleting(false);
    }
  }

  function handleFeedbackSuccess() {
    sessionStorage.setItem(POST_COOKING_TOAST_KEY, POST_COOKING_TOAST_MESSAGE);
    setIsFeedbackOpen(false);
    router.push("/");
  }

  if (isInitializing) {
    return (
      <CookingModeShell recipeSlug={recipe.slug}>
        <div className="grid flex-1 place-items-center text-charcoal/70">
          Đang tải phiên nấu...
        </div>
      </CookingModeShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <CookingModeShell recipeSlug={recipe.slug}>
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10">
          <h1 className="text-3xl font-bold text-charcoal">{recipe.title}</h1>
          <p className="mt-4 text-charcoal/70">
            Bạn cần đăng nhập để bắt đầu nấu và lưu tiến độ trên máy chủ.
          </p>
          <ButtonPrimary
            type="button"
            onClick={() => {
              requireAuth(() => {
                void initializeSession();
              });
            }}
            className="mt-8 w-full sm:w-auto"
          >
            Đăng nhập để nấu
          </ButtonPrimary>
          <button
            type="button"
            onClick={openAuthModal}
            className="mt-4 text-sm font-medium text-charcoal underline-offset-4 hover:text-terracotta hover:underline"
          >
            Hoặc mở form đăng nhập
          </button>
        </div>
      </CookingModeShell>
    );
  }

  if (loadError) {
    return (
      <CookingModeShell recipeSlug={recipe.slug}>
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10">
          <ErrorState
            title="Không thể bắt đầu nấu"
            description={loadError}
            onRetry={() => {
              void initializeSession();
            }}
          />
        </div>
      </CookingModeShell>
    );
  }

  if (isLoadingSession || !session || !currentStep) {
    return (
      <CookingModeShell recipeSlug={recipe.slug}>
        <div className="grid flex-1 place-items-center text-charcoal/70">
          Đang chuẩn bị công thức...
        </div>
      </CookingModeShell>
    );
  }

  return (
    <CookingModeShell recipeSlug={recipe.slug}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
        <CookingProgressBar
          currentStep={currentStepNumber}
          totalSteps={totalSteps}
        />

        <div className="mt-8 flex flex-1 flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <CookingStepContent
              cookingTerms={recipe.cookingTerms}
              step={currentStep}
              stepNumber={currentStepNumber}
            />
          </div>

          {currentStep.timerSeconds ? (
            <div className="lg:w-72 lg:shrink-0">
              <CookingTimerPanel
                key={currentStep.id}
                timerSeconds={currentStep.timerSeconds}
              />
            </div>
          ) : null}
        </div>

        {actionError ? (
          <p className="mt-6 text-sm text-terracotta" role="alert">
            {actionError}
          </p>
        ) : null}

        <div className="sticky bottom-0 mt-8 border-t border-terracotta/15 bg-[#fff8ec] py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <StepNavigationButtons
            canGoBack={currentStepNumber > 1}
            canGoForward
            isCompleting={isCompleting}
            isLastStep={isLastStep}
            onBack={() => {
              void handleBack();
            }}
            onForward={() => {
              void handleForward();
            }}
          />
        </div>
      </div>

      <FeedbackModal
        cookingSessionId={session.id}
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSuccess={handleFeedbackSuccess}
      />
    </CookingModeShell>
  );
}

interface CookingModeShellProps {
  children: React.ReactNode;
  recipeSlug: string;
}

function CookingModeShell({
  children,
  recipeSlug,
}: CookingModeShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fff8ec]">
      <header className="flex items-center justify-between gap-4 border-b border-terracotta/15 px-4 py-4 sm:px-6">
        <Link
          href={`/cong-thuc/${recipeSlug}`}
          className="inline-flex items-center gap-2 font-semibold text-charcoal transition hover:text-terracotta focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
        >
          <span className="inline-flex size-11 items-center justify-center rounded-full bg-white text-charcoal shadow-warm">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5 fill-none stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </span>
          <span className="hidden sm:inline">Quay lại công thức</span>
        </Link>
      </header>

      {children}
    </div>
  );
}

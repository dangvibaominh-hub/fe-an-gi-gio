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
import { LoadingState } from "@/components/ui/LoadingState";
import Stepper, { Step } from "@/components/ui/Stepper";
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
  const { isAuthenticated, isInitializing, openAuthModal, requireAuth } =
    useAuth();

  const [session, setSession] = useState<CookingSession | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [stepDirection, setStepDirection] = useState(0);

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
    setStepDirection(-1);

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
    setStepDirection(1);

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
        <CenteredPanel>Đang tải phiên nấu...</CenteredPanel>
      </CookingModeShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <CookingModeShell recipeSlug={recipe.slug}>
        <div className="mx-auto flex w-full max-w-lg flex-col justify-center rounded-lg bg-[#fff8f0] p-8 shadow-warm">
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
        <div className="mx-auto w-full max-w-lg rounded-lg bg-[#fff8f0] p-8 shadow-warm">
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
        <div className="flex min-h-[calc(100vh-1.5rem)] items-center justify-center sm:min-h-[calc(100vh-2.5rem)]">
          <LoadingState message="Đang chuẩn bị chế độ nấu..." />
        </div>
      </CookingModeShell>
    );
  }

  const timerSeconds =
    currentStep.timerSeconds ?? Math.max(currentStep.estimatedMinutes, 1) * 60;

  return (
    <CookingModeShell recipeSlug={recipe.slug}>
      <section className="relative flex h-full min-h-0 w-full flex-col p-3 sm:p-4 lg:p-6">
        <Link
          href={`/cong-thuc/${recipe.slug}`}
          aria-label="Đóng chế độ nấu"
          className="absolute left-4 top-4 z-10 inline-flex size-8 items-center justify-center rounded-full bg-[#fde9e3] text-charcoal transition hover:bg-terracotta hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4 fill-none stroke-current"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </Link>

        <div className="shrink-0 pl-10 sm:px-12">
          <CookingProgressBar
            currentStep={currentStepNumber}
            totalSteps={totalSteps}
          />
        </div>

        <div className="mt-4 min-h-0 flex-1">
          <CookingStepContent
            cookingTerms={recipe.cookingTerms}
            ingredients={recipe.ingredients}
            recipeImage={recipe.image}
            recipeImageAlt={recipe.imageAlt}
            step={currentStep}
            stepNumber={currentStepNumber}
            totalSteps={totalSteps}
            timerPanel={
              <CookingTimerPanel
                key={currentStep.id}
                timerSeconds={timerSeconds}
              />
            }
          />
        </div>

        <div className="mt-4 shrink-0">
          <Stepper
            initialStep={currentStepNumber}
            currentStep={currentStepNumber}
            currentStepDirection={stepDirection}
            disableStepIndicators
            showContent={false}
            showFooter={false}
            stepCircleContainerClassName="cooking-stepper"
            stepContainerClassName="cooking-stepper-row"
            contentClassName="cooking-stepper-content"
            footerClassName="cooking-stepper-footer"
            aria-label={`Tiến độ từng bước: bước ${currentStepNumber} trên ${totalSteps}`}
          >
            {recipe.steps.map((step, index) => (
              <Step key={step.id}>
                <span className="sr-only">Bước {index + 1}</span>
              </Step>
            ))}
          </Stepper>
        </div>

        {actionError ? (
          <p className="mt-4 text-sm font-semibold text-terracotta" role="alert">
            {actionError}
          </p>
        ) : null}

        <div className="mt-4 shrink-0 border-t border-terracotta/10 pt-3">
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
      </section>

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
  children?: React.ReactNode;
  recipeSlug: string;
}

function CookingModeShell({ children }: CookingModeShellProps) {
  return (
    <main className="h-screen overflow-hidden bg-[#fff8ec] px-3 py-3 sm:px-6 sm:py-5">
      {children}
    </main>
  );
}

function CenteredPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-[60vh] w-full max-w-lg place-items-center rounded-lg bg-[#fff8f0] p-8 text-center font-semibold text-charcoal/70 shadow-warm">
      {children}
    </div>
  );
}

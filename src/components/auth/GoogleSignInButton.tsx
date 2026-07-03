"use client";

import { useEffect, useRef, useState } from "react";

import { ApiRequestError } from "@/lib/api/errors";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  getGoogleClientId,
  loadGoogleIdentityScript,
} from "@/lib/auth/googleOAuth";

interface GoogleSignInButtonProps {
  disabled?: boolean;
  onAuthenticated?: () => void;
  onError?: (message: string) => void;
}

export function GoogleSignInButton({
  disabled = false,
  onAuthenticated,
  onError,
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const cancelCheckRef = useRef<number | null>(null);
  const loginAttemptRef = useRef(false);
  const popupObservedRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { loginWithGoogleToken } = useAuth();
  const clientId = getGoogleClientId();

  useEffect(() => {
    if (!clientId || !buttonRef.current || disabled) {
      return;
    }

    let cancelled = false;
    const container = buttonRef.current;

    function clearCancelCheck() {
      if (cancelCheckRef.current !== null) {
        window.clearTimeout(cancelCheckRef.current);
        cancelCheckRef.current = null;
      }
    }

    function finishAttempt() {
      clearCancelCheck();
      loginAttemptRef.current = false;
      popupObservedRef.current = false;
    }

    function handleWindowBlur() {
      if (loginAttemptRef.current) {
        popupObservedRef.current = true;
      }
    }

    function handleWindowFocus() {
      if (!loginAttemptRef.current || !popupObservedRef.current) {
        return;
      }

      clearCancelCheck();
      cancelCheckRef.current = window.setTimeout(() => {
        if (!loginAttemptRef.current) {
          return;
        }

        finishAttempt();
        setIsProcessing(false);
        onError?.("Bạn đã hủy đăng nhập bằng Google.");
      }, 1_000);
    }

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    void loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !container || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            finishAttempt();
            void loginWithGoogleToken(response.credential)
              .then(() => {
                onAuthenticated?.();
              })
              .catch((error: unknown) => {
                onError?.(
                  error instanceof ApiRequestError
                    ? error.message
                    : "Không thể đăng nhập bằng Google. Vui lòng thử lại.",
                );
              })
              .finally(() => {
                setIsProcessing(false);
              });
          },
        });

        window.google.accounts.id.renderButton(container, {
          click_listener: () => {
            clearCancelCheck();
            loginAttemptRef.current = true;
            popupObservedRef.current = false;
            setIsProcessing(true);
          },
          locale: "vi",
          size: "large",
          text: "continue_with",
          theme: "outline",
          type: "standard",
          width: container.offsetWidth || 320,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setIsProcessing(false);
          onError?.(
            "Không tải được Google Sign-In. Vui lòng kiểm tra kết nối và thử lại.",
          );
        }
      });

    return () => {
      cancelled = true;
      finishAttempt();
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      container.replaceChildren();
    };
  }, [
    clientId,
    disabled,
    loginWithGoogleToken,
    onAuthenticated,
    onError,
  ]);

  if (!clientId) {
    return null;
  }

  return (
    <div className="relative min-h-12 w-full">
      <div
        ref={buttonRef}
        aria-hidden={isProcessing}
        className={[
          "flex min-h-12 w-full justify-center transition-opacity",
          disabled || isProcessing
            ? "pointer-events-none opacity-0"
            : "opacity-100",
        ].join(" ")}
      />

      {isProcessing ? (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-0 flex min-h-12 items-center justify-center gap-3 rounded-md border border-[#747775] bg-white px-4 text-sm font-medium text-[#1f1f1f]"
        >
          <span
            aria-hidden="true"
            className="size-5 animate-spin rounded-full border-2 border-charcoal/20 border-t-terracotta"
          />
          Đang đăng nhập với Google...
        </div>
      ) : null}
    </div>
  );
}

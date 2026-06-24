"use client";

import { useEffect, useRef } from "react";

import { useAuth } from "@/lib/auth/AuthProvider";
import {
  getGoogleClientId,
  loadGoogleIdentityScript,
} from "@/lib/auth/googleOAuth";

interface GoogleSignInButtonProps {
  disabled?: boolean;
}

export function GoogleSignInButton({
  disabled = false,
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { loginWithGoogleToken } = useAuth();
  const clientId = getGoogleClientId();

  useEffect(() => {
    if (!clientId || !buttonRef.current || disabled) {
      return;
    }

    let cancelled = false;
    const container = buttonRef.current;

    void loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !container || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            void loginWithGoogleToken(response.credential);
          },
        });

        window.google.accounts.id.renderButton(container, {
          locale: "vi",
          size: "large",
          text: "continue_with",
          theme: "outline",
          type: "standard",
          width: container.offsetWidth || 320,
        });
      })
      .catch(() => {
        // Google button stays hidden if script fails to load.
      });

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [clientId, disabled, loginWithGoogleToken]);

  if (!clientId) {
    return null;
  }

  return (
    <div
      ref={buttonRef}
      className={[
        "flex min-h-12 w-full justify-center",
        disabled ? "pointer-events-none opacity-50" : "",
      ].join(" ")}
    />
  );
}

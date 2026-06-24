"use client";

import { useEffect, useState } from "react";

import { Toast } from "@/components/ui/Toast";
import { POST_COOKING_TOAST_KEY } from "@/lib/constants/feedback";

function readPostCookingToastMessage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedMessage = sessionStorage.getItem(POST_COOKING_TOAST_KEY);

  if (!storedMessage) {
    return null;
  }

  sessionStorage.removeItem(POST_COOKING_TOAST_KEY);
  return storedMessage;
}

export function PostCookingToast() {
  const [message, setMessage] = useState<string | null>(readPostCookingToastMessage);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(() => setMessage(null), 3500);

    return () => window.clearTimeout(timeoutId);
  }, [message]);

  if (!message) {
    return null;
  }

  return <Toast message={message} />;
}

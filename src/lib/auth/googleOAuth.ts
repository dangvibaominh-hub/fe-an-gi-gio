declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            callback: (response: { credential: string }) => void;
            client_id: string;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              locale?: string;
              size?: "large" | "medium" | "small";
              text?: "continue_with" | "signin_with" | "signup_with";
              theme?: "filled_black" | "filled_blue" | "outline";
              type?: "icon" | "standard";
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

let scriptPromise: Promise<void> | null = null;

export function getGoogleClientId(): string | null {
  const configuredClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

  return configuredClientId || null;
}

export function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Không tải được Google Sign-In."));
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
}

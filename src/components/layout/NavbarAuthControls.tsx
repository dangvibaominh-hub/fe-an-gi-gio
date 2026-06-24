"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { AuthModal } from "@/components/modals/AuthModal";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { Toast } from "@/components/ui/Toast";
import {
  getUserInitial,
  useAuth,
} from "@/lib/auth/AuthProvider";

export function NavbarAuthControls() {
  const {
    closeAuthModal,
    isAuthModalOpen,
    isAuthenticated,
    isInitializing,
    logout,
    openAuthModal,
    user,
  } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setToastMessage(null),
      2500,
    );

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    function closeMenu(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    function closeMenuWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeMenuWithEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenuWithEscape);
    };
  }, [isUserMenuOpen]);

  function handleAuthSuccess(mode: "login" | "register") {
    setToastMessage(
      mode === "login"
        ? "Đăng nhập thành công"
        : "Đăng ký thành công",
    );
  }

  async function handleSignOut() {
    await logout();
    setIsUserMenuOpen(false);
    setToastMessage("Đăng xuất thành công");
  }

  if (isInitializing) {
    return (
      <div
        aria-hidden="true"
        className="size-10 shrink-0 rounded-full bg-terracotta/10"
      />
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            aria-label="Mở menu tài khoản"
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
            onClick={() =>
              setIsUserMenuOpen((currentValue) => !currentValue)
            }
            className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-terracotta to-mustard font-bold text-white shadow-warm transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
          >
            {getUserInitial(user)}
          </button>

          {isUserMenuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-terracotta/20 bg-white p-2 shadow-xl"
            >
              <UserMenuLink
                href="/ho-so"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Hồ sơ
              </UserMenuLink>
              <UserMenuLink
                href="/ho-so?tab=cai-dat"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Cài đặt
              </UserMenuLink>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  void handleSignOut();
                }}
                className="w-full rounded-xl px-4 py-3 text-left font-medium text-charcoal transition hover:bg-terracotta/10 hover:text-terracotta focus-visible:outline-2 focus-visible:outline-terracotta"
              >
                Đăng xuất
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <ButtonSecondary
          onClick={openAuthModal}
          className="shrink-0 px-4 py-2 text-sm sm:px-6 sm:text-base"
        >
          Đăng nhập
        </ButtonSecondary>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onAuthenticated={handleAuthSuccess}
      />

      {toastMessage ? <Toast message={toastMessage} /> : null}
    </>
  );
}

interface UserMenuLinkProps {
  children: string;
  href: string;
  onClick: () => void;
}

function UserMenuLink({
  children,
  href,
  onClick,
}: UserMenuLinkProps) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="block rounded-xl px-4 py-3 font-medium text-charcoal transition hover:bg-terracotta/10 hover:text-terracotta focus-visible:outline-2 focus-visible:outline-terracotta"
    >
      {children}
    </Link>
  );
}

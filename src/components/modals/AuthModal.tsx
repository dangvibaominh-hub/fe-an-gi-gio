"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { ModalBase } from "@/components/modals/ModalBase";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ApiRequestError } from "@/lib/api/errors";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getGoogleClientId } from "@/lib/auth/googleOAuth";

type AuthMode = "login" | "register";
type AuthField = "name" | "email" | "password";
type AuthErrors = Partial<Record<AuthField, string>>;

export interface AuthModalProps {
  isOpen: boolean;
  onAuthenticated?: (mode: AuthMode) => void;
  onClose: () => void;
}

const INITIAL_FORM_VALUES = {
  email: "",
  name: "",
  password: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function AuthModal({
  isOpen,
  onAuthenticated,
  onClose,
}: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headingId = "auth-modal-heading";
  const hasGoogleSignIn = Boolean(getGoogleClientId());

  function updateField(
    field: AuthField,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;

    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    setFormError(null);
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrors({});
    setFormError(null);
  }

  function validateForm() {
    const nextErrors: AuthErrors = {};

    if (mode === "register" && !formValues.name.trim()) {
      nextErrors.name = "Vui lòng nhập tên của bạn.";
    }

    if (!formValues.email.trim()) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!EMAIL_PATTERN.test(formValues.email.trim())) {
      nextErrors.email = "Email chưa đúng định dạng.";
    }

    if (!formValues.password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (formValues.password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Mật khẩu cần có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`;
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (mode === "register") {
        await register(
          formValues.email.trim(),
          formValues.password,
          formValues.name.trim(),
        );
      } else {
        await login(formValues.email.trim(), formValues.password);
      }

      setFormValues(INITIAL_FORM_VALUES);
      setErrors({});
      setMode("login");
      onAuthenticated?.(mode);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setFormError(error.message);
      } else {
        setFormError("Không thể đăng nhập. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeModal() {
    setIsSubmitting(false);
    setErrors({});
    setFormError(null);
    onClose();
  }

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={closeModal}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="sr-only">
        Đăng nhập hoặc đăng ký
      </h2>

      <div
        role="tablist"
        aria-label="Chọn hình thức xác thực"
        className="mr-12 grid grid-cols-2 border-b border-terracotta/20"
      >
        <AuthTab
          id="auth-login-tab"
          controls="auth-form-panel"
          isActive={mode === "login"}
          onClick={() => changeMode("login")}
        >
          Đăng nhập
        </AuthTab>
        <AuthTab
          id="auth-register-tab"
          controls="auth-form-panel"
          isActive={mode === "register"}
          onClick={() => changeMode("register")}
        >
          Đăng ký
        </AuthTab>
      </div>

      <div
        id="auth-form-panel"
        role="tabpanel"
        aria-labelledby={
          mode === "login" ? "auth-login-tab" : "auth-register-tab"
        }
        className="pt-7"
      >
        <form noValidate onSubmit={handleSubmit}>
          <div className="space-y-5">
            {mode === "register" ? (
              <AuthFieldInput
                id="auth-name"
                label="Tên"
                value={formValues.name}
                error={errors.name}
                autoComplete="name"
                placeholder="Nhập tên của bạn"
                onChange={(event) => updateField("name", event)}
              />
            ) : null}

            <AuthFieldInput
              id="auth-email"
              label="Email"
              type="email"
              value={formValues.email}
              error={errors.email}
              autoComplete="email"
              placeholder="Nhập địa chỉ email của bạn"
              onChange={(event) => updateField("email", event)}
            />

            <AuthFieldInput
              id="auth-password"
              label="Mật khẩu"
              type="password"
              value={formValues.password}
              error={errors.password}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder="Nhập mật khẩu"
              onChange={(event) => updateField("password", event)}
            />
          </div>

          {formError ? (
            <p className="mt-4 text-sm text-terracotta" role="alert">
              {formError}
            </p>
          ) : null}

          <ButtonPrimary
            type="submit"
            disabled={isSubmitting}
            className="mt-7 w-full"
          >
            {isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
          </ButtonPrimary>
        </form>

        {hasGoogleSignIn ? (
          <>
            <div className="my-6 flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-terracotta/25" />
              <span className="text-sm font-medium text-charcoal/60">
                hoặc
              </span>
              <span className="h-px flex-1 bg-terracotta/25" />
            </div>

            <GoogleSignInButton disabled={isSubmitting} />
          </>
        ) : null}

        <button
          type="button"
          onClick={closeModal}
          className="mx-auto mt-6 block font-medium text-charcoal underline-offset-4 transition hover:text-terracotta hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
        >
          Dùng thử không cần đăng nhập
          <span aria-hidden="true"> →</span>
        </button>
      </div>
    </ModalBase>
  );
}

interface AuthTabProps {
  children: string;
  controls: string;
  id: string;
  isActive: boolean;
  onClick: () => void;
}

function AuthTab({
  children,
  controls,
  id,
  isActive,
  onClick,
}: AuthTabProps) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-controls={controls}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      className={[
        "border-b-2 px-4 py-4 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
        isActive
          ? "border-terracotta text-terracotta"
          : "border-transparent text-charcoal hover:text-terracotta",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

interface AuthFieldInputProps {
  autoComplete: string;
  error?: string;
  id: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: "email" | "password" | "text";
  value: string;
}

function AuthFieldInput({
  autoComplete,
  error,
  id,
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: AuthFieldInputProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="font-semibold text-charcoal">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={[
          "mt-2 min-h-12 w-full rounded-xl border bg-cream/40 px-4 py-3 text-charcoal outline-none transition placeholder:text-charcoal/45",
          "focus:border-terracotta focus:ring-2 focus:ring-terracotta/20",
          error ? "border-terracotta" : "border-terracotta/30",
        ].join(" ")}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-terracotta">
          {error}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import { ModalBase } from "@/components/modals/ModalBase";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { loginUser, registerUser } from "@/lib/api";
import { storeSession } from "@/lib/authSession";

type AuthMode = "login" | "register";
type AuthField = "name" | "email" | "password";
type AuthErrors = Partial<Record<AuthField, string>>;
type AuthFormValues = Record<AuthField, string>;

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mode: AuthMode) => void;
}

const INITIAL_FORM_VALUES: AuthFormValues = {
  email: "",
  name: "",
  password: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEADING_ID = "auth-modal-heading";

const AUTH_TABS: Array<{ id: AuthMode; label: string }> = [
  { id: "login", label: "Đăng nhập" },
  { id: "register", label: "Đăng ký" },
];

const SUBMIT_ERROR_MESSAGES: Record<AuthMode, string> = {
  login: "Không thể đăng nhập với thông tin này.",
  register: "Không thể tạo tài khoản. Bạn thử lại nhé.",
};

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function updateField(
    field: AuthField,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;

    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setSubmitError(null);
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setSubmitError(null);
    setErrors({});
  }

  function resetFormState() {
    setFormValues(INITIAL_FORM_VALUES);
    setErrors({});
    setSubmitError(null);
    setMode("login");
  }

  function continueWithGoogle() {
    setSubmitError("Đăng nhập bằng Google chưa được hỗ trợ trong bản này.");
  }

  function validateForm() {
    const nextErrors = validateAuthForm(mode, formValues);

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const authResult = await submitAuthForm(mode, formValues);

      storeSession(authResult.data);
      setIsSubmitting(false);
      resetFormState();
      onSuccess(mode);
    } catch {
      setIsSubmitting(false);
      setSubmitError(SUBMIT_ERROR_MESSAGES[mode]);
    }
  }

  function closeModal() {
    setIsSubmitting(false);
    setSubmitError(null);
    setErrors({});
    onClose();
  }

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={closeModal}
      aria-labelledby={HEADING_ID}
      panelClassName="max-w-[420px] overflow-hidden rounded-xl p-0 sm:p-0"
    >
      <h2 id={HEADING_ID} className="sr-only">
        Đăng nhập hoặc đăng ký
      </h2>

      <AuthBrandHeader />
      <AuthTabs activeMode={mode} onChange={changeMode} />

      <div
        id="auth-form-panel"
        role="tabpanel"
        aria-labelledby={
          mode === "login" ? "auth-login-tab" : "auth-register-tab"
        }
        className="px-7 pb-7 pt-6"
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
              icon="email"
              onChange={(event) => updateField("email", event)}
            />

            <AuthFieldInput
              id="auth-password"
              label="Mật khẩu"
              type={isPasswordVisible ? "text" : "password"}
              value={formValues.password}
              error={errors.password}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder="Nhập mật khẩu"
              icon="password"
              rightAction={
                <button
                  type="button"
                  aria-label={
                    isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                  onClick={() =>
                    setIsPasswordVisible((currentValue) => !currentValue)
                  }
                  className="grid size-8 place-items-center rounded-full text-charcoal/55 transition hover:bg-terracotta/10 hover:text-terracotta focus-visible:outline-2 focus-visible:outline-terracotta"
                >
                  <EyeGlyph isVisible={isPasswordVisible} />
                </button>
              }
              onChange={(event) => updateField("password", event)}
            />
          </div>

          {mode === "login" ? (
            <button
              type="button"
              className="ml-auto mt-3 block text-xs font-semibold text-terracotta transition hover:text-[#a94432] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-terracotta"
            >
              Quên mật khẩu?
            </button>
          ) : null}

          <ButtonPrimary
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg from-[#a94432] to-[#a94432] py-2.5 shadow-none"
          >
            {isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
          </ButtonPrimary>
          {submitError ? (
            <p className="mt-3 text-sm font-medium text-terracotta">
              {submitError}
            </p>
          ) : null}
        </form>

        <AuthDivider />

        <ButtonSecondary
          type="button"
          onClick={continueWithGoogle}
          disabled={isSubmitting}
          className="min-h-11 w-full rounded-lg border-terracotta/35 bg-white px-4 py-2 text-sm text-charcoal shadow-none hover:bg-terracotta/5"
        >
          <GoogleGlyph />
          Tiếp tục với Google
        </ButtonSecondary>

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

function AuthBrandHeader() {
  return (
    <div className="border-b border-terracotta/15 px-7 pb-7 pt-7 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
        <BrandGlyph />
      </div>
      <p className="mt-4 text-lg font-bold text-terracotta">ĂnGìGiờ?</p>
      <p className="mt-1 text-xs font-medium tracking-[0.08em] text-charcoal/70">
        The Patient Mentor
      </p>
    </div>
  );
}

function AuthTabs({
  activeMode,
  onChange,
}: {
  activeMode: AuthMode;
  onChange: (mode: AuthMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Chọn hình thức xác thực"
      className="grid grid-cols-2 border-b border-terracotta/20 px-7"
    >
      {AUTH_TABS.map((tab) => (
        <AuthTab
          key={tab.id}
          id={`auth-${tab.id}-tab`}
          controls="auth-form-panel"
          isActive={activeMode === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </AuthTab>
      ))}
    </div>
  );
}

function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-4" aria-hidden="true">
      <span className="h-px flex-1 bg-terracotta/25" />
      <span className="text-sm font-medium text-charcoal/60">hoặc</span>
      <span className="h-px flex-1 bg-terracotta/25" />
    </div>
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
  icon?: "email" | "password";
  id: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  rightAction?: ReactNode;
  type?: "email" | "password" | "text";
  value: string;
}

function AuthFieldInput({
  autoComplete,
  error,
  icon,
  id,
  label,
  onChange,
  placeholder,
  rightAction,
  type = "text",
  value,
}: AuthFieldInputProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-charcoal">
        {label}
      </label>
      <div
        className={[
          "mt-2 flex min-h-11 items-center gap-2 rounded-lg border bg-cream/35 px-3 text-charcoal transition focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/20",
          error ? "border-terracotta" : "border-terracotta/30",
        ].join(" ")}
      >
        {icon ? <InputGlyph icon={icon} /> : null}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-charcoal/45"
        />
        {rightAction}
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-terracotta">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function InputGlyph({ icon }: { icon: "email" | "password" }) {
  if (icon === "email") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4 shrink-0 fill-none stroke-current text-charcoal/50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 shrink-0 fill-none stroke-current text-charcoal/50"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeGlyph({ isVisible }: { isVisible: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isVisible ? (
        <>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="m3 3 18 18" />
          <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
          <path d="M9.9 5.3A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 4.1" />
          <path d="M6.1 6.1C3.5 7.8 2 12 2 12a17.5 17.5 0 0 0 5.6 5.8A9.8 9.8 0 0 0 12 19c1 0 1.9-.1 2.7-.4" />
        </>
      )}
    </svg>
  );
}

function BrandGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-7 fill-current"
    >
      <path d="M7 2a1 1 0 0 1 1 1v6a3 3 0 0 1-2 2.83V21a1 1 0 1 1-2 0v-9.17A3 3 0 0 1 2 9V3a1 1 0 0 1 2 0v6h1V3a1 1 0 0 1 2 0v6h1V3a1 1 0 0 1 1-1Zm8 0a5 5 0 0 1 5 5v5a1 1 0 0 1-1 1h-2v8a1 1 0 1 1-2 0V2Z" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 12h-8M20 12a8 8 0 1 1-2.3-5.7M20 12c0 4.4-3.2 8-8 8" />
    </svg>
  );
}

function validateAuthForm(mode: AuthMode, formValues: AuthFormValues) {
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
  } else if (formValues.password.length < 6) {
    nextErrors.password = "Mật khẩu cần có ít nhất 6 ký tự.";
  }

  return nextErrors;
}

function submitAuthForm(mode: AuthMode, formValues: AuthFormValues) {
  const email = formValues.email.trim();

  if (mode === "login") {
    return loginUser({
      email,
      password: formValues.password,
    });
  }

  return registerUser({
    displayName: formValues.name.trim(),
    email,
    password: formValues.password,
  });
}

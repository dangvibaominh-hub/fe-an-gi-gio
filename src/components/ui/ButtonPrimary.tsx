import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type ButtonPrimaryButtonProps = ComponentPropsWithoutRef<"button"> & {
  href?: never;
};

type ButtonPrimaryLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "className"
> & {
  className?: string;
  href: string;
};

export type ButtonPrimaryProps =
  | ButtonPrimaryButtonProps
  | ButtonPrimaryLinkProps;

const BUTTON_PRIMARY_CLASSES = [
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-terracotta to-mustard px-7 py-3 font-semibold text-white shadow-warm transition duration-200 ease-out",
  "hover:scale-[1.02] hover:brightness-105 active:scale-[0.99] active:brightness-95",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
  "disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none",
].join(" ");

export function ButtonPrimary(props: ButtonPrimaryProps) {
  if ("href" in props && props.href) {
    const { className = "", ...linkProps } = props;

    return (
      <Link
        className={`${BUTTON_PRIMARY_CLASSES} ${className}`}
        {...linkProps}
      />
    );
  }

  const {
    className = "",
    type = "button",
    ...buttonProps
  } = props as ButtonPrimaryButtonProps;

  return (
    <button
      type={type}
      className={`${BUTTON_PRIMARY_CLASSES} ${className}`}
      {...buttonProps}
    />
  );
}

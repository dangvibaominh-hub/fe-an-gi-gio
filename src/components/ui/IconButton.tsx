import type { ComponentPropsWithoutRef } from "react";

type IconButtonShape = "circle" | "rounded";

export interface IconButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "aria-label"> {
  "aria-label": string;
  isActive?: boolean;
  shape?: IconButtonShape;
}

export function IconButton({
  "aria-label": ariaLabel,
  className = "",
  isActive = false,
  shape = "circle",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-pressed={isActive || undefined}
      className={[
        "inline-flex size-11 shrink-0 items-center justify-center border-0 transition duration-200 ease-out",
        "hover:bg-terracotta/10 active:scale-95 active:bg-terracotta/15",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
        "disabled:pointer-events-none disabled:opacity-40",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        isActive ? "bg-terracotta/10 text-terracotta" : "bg-transparent text-charcoal",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

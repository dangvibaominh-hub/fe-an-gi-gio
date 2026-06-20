import type { ComponentPropsWithoutRef } from "react";

export type ButtonSecondaryProps = ComponentPropsWithoutRef<"button">;

export function ButtonSecondary({
  className = "",
  type = "button",
  ...props
}: ButtonSecondaryProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-terracotta bg-transparent px-7 py-3 font-semibold text-terracotta transition duration-200 ease-out",
        "hover:bg-terracotta/10 active:scale-[0.99] active:bg-terracotta/15",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

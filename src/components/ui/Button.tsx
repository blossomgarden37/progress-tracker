import Link from "next/link";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary:
    "bg-white text-blue-700 ring-1 ring-inset ring-blue-200 hover:bg-blue-50",
  danger: "bg-red-600 text-white hover:bg-red-500",
};

type Variant = keyof typeof variants;

type ButtonProps = {
  variant?: Variant;
  className?: string;
  href?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(base, variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

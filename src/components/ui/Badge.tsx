import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

export function Badge({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

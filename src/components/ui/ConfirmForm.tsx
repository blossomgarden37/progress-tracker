"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";

export function ConfirmForm({
  action,
  confirmMessage,
  variant = "danger",
  children,
}: {
  action: () => void;
  confirmMessage: string;
  variant?: "danger" | "secondary" | "primary";
  children: ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <Button type="submit" variant={variant}>
        {children}
      </Button>
    </form>
  );
}

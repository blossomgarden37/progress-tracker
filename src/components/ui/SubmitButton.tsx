"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./Button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "保存中..." : children}
    </Button>
  );
}

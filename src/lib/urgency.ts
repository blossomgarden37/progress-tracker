import type { TaskStatus } from "./types";

export type UrgencyLevel = "overdue" | "urgent" | "soon" | "normal" | "done";

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getDaysUntilDue(dueDate: string): number {
  const [y, m, d] = dueDate.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  const diffMs = due.getTime() - startOfToday().getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getUrgencyLevel(
  dueDate: string,
  status: TaskStatus,
): UrgencyLevel {
  if (status === "completed") return "done";
  const days = getDaysUntilDue(dueDate);
  if (days < 0) return "overdue";
  if (days <= 2) return "urgent";
  if (days <= 5) return "soon";
  return "normal";
}

export const URGENCY_LABEL: Record<UrgencyLevel, string> = {
  overdue: "期限超過",
  urgent: "期限間近",
  soon: "まもなく期限",
  normal: "期限に余裕あり",
  done: "完了",
};

export const URGENCY_BADGE_CLASS: Record<UrgencyLevel, string> = {
  overdue: "bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20",
  urgent: "bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  soon: "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  normal: "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-600/15",
  done: "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
};

export const URGENCY_ROW_CLASS: Record<UrgencyLevel, string> = {
  overdue: "bg-red-50/70",
  urgent: "bg-rose-50/60",
  soon: "bg-amber-50/50",
  normal: "",
  done: "opacity-60",
};

export function formatDueLabel(dueDate: string, status: TaskStatus): string {
  const days = getDaysUntilDue(dueDate);
  if (status === "completed") return "完了済み";
  if (days === 0) return "本日が期限";
  if (days < 0) return `期限を${Math.abs(days)}日超過`;
  return `期限まであと${days}日`;
}

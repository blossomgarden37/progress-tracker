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

// バッジで期限の緊急度を目立たせるための配色。overdue/urgent/soonは
// カード自体の背景色は変えず、このバッジの彩度で注意を引く。
export const URGENCY_BADGE_CLASS: Record<UrgencyLevel, string> = {
  overdue: "bg-red-600 text-white",
  urgent: "bg-rose-500 text-white",
  soon: "bg-amber-500 text-white",
  normal: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15",
  done: "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-400/20",
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

import type { TaskStatus } from "./types";

export type UrgencyLevel =
  | "overdue"
  | "today"
  | "urgent"
  | "soon"
  | "normal"
  | "done";

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
  if (days === 0) return "today";
  if (days <= 3) return "urgent";
  if (days <= 5) return "soon";
  return "normal";
}

export const URGENCY_LABEL: Record<UrgencyLevel, string> = {
  overdue: "期限超過",
  today: "本日期限",
  urgent: "期限間近",
  soon: "まもなく期限",
  normal: "期限に余裕あり",
  done: "完了",
};

// バッジで期限の緊急度を目立たせるための配色。overdue/today/urgent/soonは
// カード自体の背景色は変えず、このバッジの彩度で注意を引く。
// 赤色は「期限超過」「本日期限」のみに限定し、期限間近（3日以内）は
// オレンジで区別する。
export const URGENCY_BADGE_CLASS: Record<UrgencyLevel, string> = {
  overdue: "bg-red-600 text-white",
  today: "bg-red-600 text-white",
  urgent: "bg-orange-500 text-white",
  soon: "bg-amber-500 text-white",
  normal: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15",
  done: "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-400/20",
};

export const URGENCY_ROW_CLASS: Record<UrgencyLevel, string> = {
  overdue: "bg-red-50/70",
  today: "bg-red-50/60",
  urgent: "bg-yellow-100/60",
  soon: "bg-yellow-50/60",
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

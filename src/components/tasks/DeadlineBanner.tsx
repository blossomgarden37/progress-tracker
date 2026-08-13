import Link from "next/link";
import { clsx } from "clsx";
import type { TaskWithCategory } from "@/lib/types";
import { getUrgencyLevel, formatDueLabel } from "@/lib/urgency";
import { StatusBadge } from "./StatusBadge";
import { CategoryBadge } from "./CategoryBadge";

const BANNER_STYLE: Record<string, string> = {
  overdue: "border-red-300 bg-red-50",
  urgent: "border-rose-300 bg-rose-50",
  soon: "border-amber-300 bg-amber-50",
  normal: "border-blue-200 bg-white",
};

const BANNER_TEXT: Record<string, string> = {
  overdue: "text-red-700",
  urgent: "text-rose-700",
  soon: "text-amber-700",
  normal: "text-blue-700",
};

export function DeadlineBanner({ task }: { task: TaskWithCategory | null }) {
  if (!task) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white p-6 text-center text-slate-500">
        現在、期限が設定された未完了の作業はありません。
      </div>
    );
  }

  const level = getUrgencyLevel(task.due_date, task.status);
  const style = BANNER_STYLE[level] ?? BANNER_STYLE.normal;
  const text = BANNER_TEXT[level] ?? BANNER_TEXT.normal;

  return (
    <Link
      href={`/tasks/${task.id}/edit`}
      className={clsx(
        "block rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md",
        style,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={clsx(
            "text-xs font-semibold uppercase tracking-wide",
            text,
          )}
        >
          次に対応が必要な作業
        </span>
        <span className={clsx("text-sm font-bold", text)}>
          {formatDueLabel(task.due_date, task.status)}
        </span>
      </div>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        {task.project_name}
        {task.property_name ? (
          <span className="ml-2 text-lg font-medium text-slate-500">
            {task.property_name}
          </span>
        ) : null}
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <StatusBadge status={task.status} />
        <CategoryBadge category={task.category} />
        <span>担当: {task.assignee}</span>
        {task.batch_no ? <span>Badge No: {task.batch_no}</span> : null}
        <span>期限: {task.due_date}</span>
      </div>
    </Link>
  );
}

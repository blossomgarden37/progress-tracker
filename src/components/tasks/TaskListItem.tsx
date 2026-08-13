import Link from "next/link";
import { clsx } from "clsx";
import type { TaskWithCategory } from "@/lib/types";
import {
  getUrgencyLevel,
  URGENCY_BADGE_CLASS,
  URGENCY_LABEL,
} from "@/lib/urgency";
import { StatusBadge } from "./StatusBadge";
import { CategoryBadge } from "./CategoryBadge";

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={clsx("min-w-0", className)}>
      <dt className="text-[11px] font-medium text-blue-700/70">{label}</dt>
      <dd className="truncate text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export function TaskListItem({ task }: { task: TaskWithCategory }) {
  const level = getUrgencyLevel(task.due_date, task.status);
  const showUrgencyBadge =
    level === "overdue" || level === "urgent" || level === "soon";

  return (
    <Link
      href={`/tasks/${task.id}/edit`}
      className="flex w-full max-w-[900px] items-center gap-6 rounded-lg border border-blue-100 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex w-28 shrink-0 flex-col items-start gap-1.5">
        <StatusBadge status={task.status} />
        {showUrgencyBadge ? (
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
              URGENCY_BADGE_CLASS[level],
            )}
          >
            {URGENCY_LABEL[level]}
          </span>
        ) : null}
      </div>

      <dl className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-1.5">
        <Field
          label="プロジェクト名"
          value={task.project_name}
          className="min-w-[160px]"
        />
        <Field
          label="物件名"
          value={task.property_name ?? "-"}
          className="min-w-[140px]"
        />
        <Field label="担当者" value={task.assignee} className="min-w-[90px]" />
        <Field label="期限" value={task.due_date} className="min-w-[100px]" />
        <div className="flex items-center gap-2">
          <CategoryBadge category={task.category} />
          {task.needs_rework ? (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-rose-700">
              要再対応
            </span>
          ) : null}
        </div>
      </dl>
    </Link>
  );
}

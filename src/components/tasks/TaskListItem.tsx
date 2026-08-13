import Link from "next/link";
import { clsx } from "clsx";
import type { TaskWithCategory } from "@/lib/types";
import {
  getUrgencyLevel,
  URGENCY_CARD_CLASS,
  URGENCY_TEXT_CLASS,
  formatDueLabel,
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
    <div className={className}>
      <dt className="text-[11px] font-medium text-blue-700/70">{label}</dt>
      <dd className="truncate text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export function TaskListItem({ task }: { task: TaskWithCategory }) {
  const level = getUrgencyLevel(task.due_date, task.status);

  return (
    <Link
      href={`/tasks/${task.id}/edit`}
      className={clsx(
        "block rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md",
        URGENCY_CARD_CLASS[level],
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={clsx("text-xs font-semibold", URGENCY_TEXT_CLASS[level])}
        >
          {formatDueLabel(task.due_date, task.status)}
        </span>
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} />
          {task.needs_rework ? (
            <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[11px] font-semibold text-rose-700">
              要再対応
            </span>
          ) : null}
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
        <Field
          label="プロジェクト名"
          value={task.project_name}
          className="sm:col-span-2"
        />
        <Field label="物件名" value={task.property_name ?? "-"} />
        <Field label="担当者" value={task.assignee} />
        <Field label="期限" value={task.due_date} />
      </dl>

      <div className="mt-3">
        <CategoryBadge category={task.category} />
      </div>
    </Link>
  );
}

import Link from "next/link";
import { clsx } from "clsx";
import type { TaskWithCategory } from "@/lib/types";
import {
  getUrgencyLevel,
  URGENCY_BADGE_CLASS,
  URGENCY_LABEL,
} from "@/lib/urgency";
import { Badge } from "@/components/ui/Badge";
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
      <dt className="text-[11px] font-medium text-emerald-700/70">{label}</dt>
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
      className="flex w-full max-w-[900px] items-center gap-6 rounded-lg border border-emerald-100 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="w-20 shrink-0">
        <StatusBadge status={task.status} />
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

        <div className="min-w-[150px]">
          <dt className="text-[11px] font-medium text-emerald-700/70">
            期限
          </dt>
          <dd className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900">
              {task.due_date}
            </span>
            {showUrgencyBadge ? (
              <Badge className={URGENCY_BADGE_CLASS[level]}>
                {URGENCY_LABEL[level]}
              </Badge>
            ) : null}
          </dd>
        </div>

        <div className="flex items-center gap-2">
          <CategoryBadge category={task.category} />
          {task.needs_rework ? (
            <Badge className="bg-rose-100 text-rose-700">要再対応</Badge>
          ) : null}
        </div>
      </dl>
    </Link>
  );
}

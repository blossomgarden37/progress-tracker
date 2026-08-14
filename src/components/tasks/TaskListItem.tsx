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

// ヘッダー行と各案件行で同じ列幅を共有し、プロジェクト名等の文字数による
// ズレが起きないようにする（プロジェクト名/物件名/ステータス/期限/担当者/
// カテゴリ の固定幅 + 緊急度バッジ用の可変幅を右端に確保）。
export const TASK_ROW_GRID_COLS =
  "grid-cols-[240px_180px_110px_140px_110px_160px_1fr]";

// 固定列幅の合計より画面が狭い場合は横スクロールさせる（崩れ防止）。
export const TASK_ROW_MAX_WIDTH = "max-w-[1200px] min-w-[1080px]";

export function TaskListItem({ task }: { task: TaskWithCategory }) {
  const level = getUrgencyLevel(task.due_date, task.status);
  const showUrgencyBadge =
    level === "overdue" || level === "urgent" || level === "soon";

  return (
    <Link
      href={`/tasks/${task.id}/edit`}
      className={clsx(
        "grid w-full items-center gap-4 rounded-lg border border-emerald-100 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md",
        TASK_ROW_MAX_WIDTH,
        TASK_ROW_GRID_COLS,
      )}
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-slate-900">
          {task.project_name}
        </div>
        {task.needs_rework ? (
          <Badge className="mt-1 bg-rose-100 text-rose-700">要再対応</Badge>
        ) : null}
      </div>

      <div className="min-w-0 truncate text-sm text-slate-700">
        {task.property_name ?? "-"}
      </div>

      <div className="min-w-0">
        <StatusBadge status={task.status} />
      </div>

      <div className="min-w-0 text-sm text-slate-700">{task.due_date}</div>

      <div className="min-w-0 truncate text-sm text-slate-700">
        {task.assignee}
      </div>

      <div className="min-w-0">
        <CategoryBadge category={task.category} />
      </div>

      <div className="flex min-w-0 justify-end">
        {showUrgencyBadge ? (
          <Badge className={URGENCY_BADGE_CLASS[level]}>
            {URGENCY_LABEL[level]}
          </Badge>
        ) : null}
      </div>
    </Link>
  );
}

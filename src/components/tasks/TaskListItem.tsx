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
import { PriorityIcon } from "./PriorityIcon";

// ヘッダー行と各案件行で同じ列幅を共有し、プロジェクト名等の文字数による
// ズレが起きないようにする（ステータス/プロジェクト名/物件名/期限/担当者/
// 優先度/カテゴリ の固定幅 + 緊急度バッジ用の固定幅を右端に確保）。
// 固定幅の合計を900px幅のカードに収まる範囲に抑え、横スクロールが
// 発生しないようにしている。緊急度バッジ列は表示テキストに必要な分だけ
// 幅を持たせ、余った分はプロジェクト名/物件名など見えづらかった列に
// 再配分している。
export const TASK_ROW_GRID_COLS =
  "grid-cols-[75px_170px_120px_95px_65px_50px_90px_100px]";

export const TASK_ROW_MAX_WIDTH = "max-w-[900px]";

export function TaskListItem({ task }: { task: TaskWithCategory }) {
  const level = getUrgencyLevel(task.due_date, task.status);
  const showUrgencyBadge = level !== "normal" && level !== "done";

  return (
    <Link
      href={`/tasks/${task.id}/edit`}
      className={clsx(
        "grid w-full items-center gap-3 rounded-lg border border-emerald-100 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md",
        TASK_ROW_MAX_WIDTH,
        TASK_ROW_GRID_COLS,
      )}
    >
      <div className="min-w-0">
        <StatusBadge status={task.status} />
      </div>

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

      <div className="min-w-0 text-sm text-slate-700">{task.due_date}</div>

      <div className="min-w-0 truncate text-sm text-slate-700">
        {task.assignee}
      </div>

      <div className="min-w-0">
        <PriorityIcon priority={task.priority} />
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

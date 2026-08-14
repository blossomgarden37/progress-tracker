import { clsx } from "clsx";
import type { TaskWithCategory } from "@/lib/types";
import {
  TaskListItem,
  TASK_ROW_GRID_COLS,
  TASK_ROW_MAX_WIDTH,
} from "./TaskListItem";

const COLUMN_LABELS = [
  "ステータス",
  "プロジェクト名",
  "物件名",
  "期限",
  "担当者",
  "カテゴリ",
];

function TaskListHeader() {
  return (
    <div
      className={clsx(
        "grid w-full gap-3 px-5 text-xs font-semibold text-emerald-700/70",
        TASK_ROW_MAX_WIDTH,
        TASK_ROW_GRID_COLS,
      )}
    >
      {COLUMN_LABELS.map((label) => (
        <span key={label} className="truncate">
          {label}
        </span>
      ))}
      <span />
    </div>
  );
}

export function TaskList({ tasks }: { tasks: TaskWithCategory[] }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-100 bg-white p-8 text-center text-slate-500">
        条件に一致する未完了の作業はありません。
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="space-y-3">
        <TaskListHeader />
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskListItem task={task} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

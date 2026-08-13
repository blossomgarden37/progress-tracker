import Link from "next/link";
import { clsx } from "clsx";
import type { TaskWithCategory } from "@/lib/types";
import { getUrgencyLevel, URGENCY_ROW_CLASS, formatDueLabel } from "@/lib/urgency";
import { StatusBadge } from "./StatusBadge";
import { CategoryBadge } from "./CategoryBadge";

export function TaskTable({ tasks }: { tasks: TaskWithCategory[] }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-blue-100 bg-white p-8 text-center text-slate-500">
        条件に一致する作業はありません。
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white">
      <table className="min-w-full divide-y divide-blue-100 text-sm">
        <thead className="bg-blue-50 text-left text-xs font-semibold uppercase tracking-wide text-blue-700">
          <tr>
            <th className="px-4 py-3">プロジェクト / 物件</th>
            <th className="px-4 py-3">カテゴリ</th>
            <th className="px-4 py-3">Badge No</th>
            <th className="px-4 py-3">担当者</th>
            <th className="px-4 py-3">期限</th>
            <th className="px-4 py-3">ステータス</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-50">
          {tasks.map((task) => {
            const level = getUrgencyLevel(task.due_date, task.status);
            return (
              <tr key={task.id} className={clsx(URGENCY_ROW_CLASS[level])}>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">
                    {task.project_name}
                  </div>
                  {task.property_name ? (
                    <div className="text-xs text-slate-500">
                      {task.property_name}
                    </div>
                  ) : null}
                  {task.needs_rework ? (
                    <span className="mt-1 inline-block rounded bg-rose-100 px-1.5 py-0.5 text-[11px] font-semibold text-rose-700">
                      要再対応
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={task.category} />
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {task.batch_no ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-600">{task.assignee}</td>
                <td className="px-4 py-3">
                  <div className="text-slate-800">{task.due_date}</div>
                  <div className="text-xs text-slate-500">
                    {formatDueLabel(task.due_date, task.status)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/tasks/${task.id}/edit`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

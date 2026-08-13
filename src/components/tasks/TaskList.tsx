import type { TaskWithCategory } from "@/lib/types";
import { TaskListItem } from "./TaskListItem";

export function TaskList({ tasks }: { tasks: TaskWithCategory[] }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-100 bg-white p-8 text-center text-slate-500">
        条件に一致する未完了の作業はありません。
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskListItem task={task} />
        </li>
      ))}
    </ul>
  );
}

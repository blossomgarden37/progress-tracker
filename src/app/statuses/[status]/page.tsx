import Link from "next/link";
import { notFound } from "next/navigation";
import { getTasks } from "@/lib/data";
import { TASK_STATUSES, STATUS_LABELS, type TaskStatus } from "@/lib/types";
import { TaskTable } from "@/components/tasks/TaskTable";

export const dynamic = "force-dynamic";

export default async function StatusTasksPage(
  props: PageProps<"/statuses/[status]">,
) {
  const { status } = await props.params;
  if (!TASK_STATUSES.includes(status as TaskStatus)) notFound();
  const taskStatus = status as TaskStatus;

  const tasks = await getTasks({ status: taskStatus });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          {STATUS_LABELS[taskStatus]}
        </h1>
        <Link
          href="/statuses"
          className="text-sm text-emerald-600 hover:text-emerald-800"
        >
          ← ステータス一覧へ戻る
        </Link>
      </div>
      <TaskTable tasks={tasks} />
    </div>
  );
}

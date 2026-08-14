import { getTasks } from "@/lib/data";
import { TaskTable } from "@/components/tasks/TaskTable";

export const dynamic = "force-dynamic";

export default async function CompletedTasksPage() {
  const tasks = await getTasks({ status: "completed" });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">完了済み一覧</h1>
      <TaskTable tasks={tasks} />
    </div>
  );
}

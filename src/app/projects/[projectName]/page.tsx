import Link from "next/link";
import { getTasks } from "@/lib/data";
import { TaskTable } from "@/components/tasks/TaskTable";

export const dynamic = "force-dynamic";

export default async function ProjectTasksPage(
  props: PageProps<"/projects/[projectName]">,
) {
  const { projectName: encoded } = await props.params;
  const projectName = decodeURIComponent(encoded);
  const tasks = await getTasks({ projectName });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">{projectName}</h1>
        <Link
          href="/projects"
          className="text-sm text-emerald-600 hover:text-emerald-800"
        >
          ← プロジェクト一覧へ戻る
        </Link>
      </div>
      <TaskTable tasks={tasks} />
    </div>
  );
}

import {
  getCategories,
  getDistinctAssignees,
  getDistinctProjectNames,
  getDistinctPropertyNames,
  getTasks,
} from "@/lib/data";
import type { TaskStatus } from "@/lib/types";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskList } from "@/components/tasks/TaskList";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const status =
    typeof params.status === "string" ? (params.status as TaskStatus) : undefined;
  const categoryId =
    typeof params.category === "string" ? params.category : undefined;
  const assignee =
    typeof params.assignee === "string" ? params.assignee : undefined;
  const projectName =
    typeof params.project === "string" ? params.project : undefined;
  const propertyName =
    typeof params.property === "string" ? params.property : undefined;
  const sort =
    typeof params.sort === "string"
      ? (params.sort as "due_date" | "input_date" | "assignee")
      : undefined;

  const [tasks, categories, assignees, projectNames, propertyNames] =
    await Promise.all([
      getTasks({
        status: status || undefined,
        categoryId: categoryId || undefined,
        assignee: assignee || undefined,
        projectName: projectName || undefined,
        propertyName: propertyName || undefined,
        sort,
        onlyIncomplete: true,
      }),
      getCategories(),
      getDistinctAssignees(),
      getDistinctProjectNames(),
      getDistinctPropertyNames(),
    ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">作業進捗一覧</h1>
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <TaskList tasks={tasks} />
        <TaskFilters
          categories={categories}
          assignees={assignees}
          projectNames={projectNames}
          propertyNames={propertyNames}
        />
      </div>
    </div>
  );
}

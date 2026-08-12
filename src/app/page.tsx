import { getCategories, getDistinctAssignees, getMostUrgentTask, getTasks } from "@/lib/data";
import type { TaskStatus } from "@/lib/types";
import { DeadlineBanner } from "@/components/tasks/DeadlineBanner";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskTable } from "@/components/tasks/TaskTable";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: PageProps<"/">) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? (params.status as TaskStatus) : undefined;
  const categoryId = typeof params.category === "string" ? params.category : undefined;
  const assignee = typeof params.assignee === "string" ? params.assignee : undefined;
  const sort =
    typeof params.sort === "string"
      ? (params.sort as "due_date" | "input_date" | "assignee")
      : undefined;

  const [urgentTask, tasks, categories, assignees] = await Promise.all([
    getMostUrgentTask(),
    getTasks({
      status: status || undefined,
      categoryId: categoryId || undefined,
      assignee: assignee || undefined,
      sort,
    }),
    getCategories(),
    getDistinctAssignees(),
  ]);

  return (
    <div className="space-y-6">
      <DeadlineBanner task={urgentTask} />
      <TaskFilters categories={categories} assignees={assignees} />
      <TaskTable tasks={tasks} />
    </div>
  );
}

import { getCategories, getDistinctAssignees, getTasks } from "@/lib/data";
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
  const sort =
    typeof params.sort === "string"
      ? (params.sort as "due_date" | "input_date" | "assignee")
      : undefined;

  const [tasks, categories, assignees] = await Promise.all([
    getTasks({
      status: status || undefined,
      categoryId: categoryId || undefined,
      assignee: assignee || undefined,
      sort,
      onlyIncomplete: true,
    }),
    getCategories(),
    getDistinctAssignees(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-slate-900">
          未完了案件（期限が近い順）
        </h1>
        <TaskList tasks={tasks} />
      </div>
      <div className="lg:sticky lg:top-8 lg:self-start">
        <TaskFilters categories={categories} assignees={assignees} />
      </div>
    </div>
  );
}

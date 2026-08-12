import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getTasks } from "@/lib/data";
import { TaskTable } from "@/components/tasks/TaskTable";

export const dynamic = "force-dynamic";

export default async function CategoryTasksPage(
  props: PageProps<"/categories/[categoryId]">,
) {
  const { categoryId } = await props.params;
  const categories = await getCategories();
  const category = categories.find((c) => c.id === categoryId);
  if (!category) notFound();

  const tasks = await getTasks({ categoryId });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <h1 className="text-xl font-bold text-slate-900">
            {category.name}
          </h1>
        </div>
        <Link
          href="/categories"
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          ← カテゴリ一覧へ戻る
        </Link>
      </div>
      <TaskTable tasks={tasks} />
    </div>
  );
}

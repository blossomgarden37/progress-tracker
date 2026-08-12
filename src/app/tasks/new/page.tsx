import { getCategories } from "@/lib/data";
import { createTask } from "@/lib/actions";
import { TaskForm } from "@/components/tasks/TaskForm";

export const dynamic = "force-dynamic";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default async function NewTaskPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">新規登録</h1>
      <TaskForm
        categories={categories}
        task={{ input_date: todayISO() }}
        action={createTask}
      />
    </div>
  );
}

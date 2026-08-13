import { notFound } from "next/navigation";
import { getCategories, getTaskById } from "@/lib/data";
import { updateTask, deleteTask } from "@/lib/actions";
import { TaskForm } from "@/components/tasks/TaskForm";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

export const dynamic = "force-dynamic";

export default async function EditTaskPage(
  props: PageProps<"/tasks/[id]/edit">,
) {
  const { id } = await props.params;
  const [task, categories] = await Promise.all([
    getTaskById(id),
    getCategories(),
  ]);
  if (!task) notFound();

  const updateTaskWithId = updateTask.bind(null, id);
  const deleteTaskWithId = deleteTask.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">作業を編集</h1>
      <TaskForm categories={categories} task={task} action={updateTaskWithId} />
      <div className="flex justify-end">
        <ConfirmForm
          action={deleteTaskWithId}
          confirmMessage="この作業を削除しますか？この操作は取り消せません。"
        >
          削除する
        </ConfirmForm>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getCategories } from "@/lib/data";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-md border border-emerald-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

export default async function CategoryManagePage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">カテゴリ管理</h1>
        <Link
          href="/categories"
          className="text-sm text-emerald-600 hover:text-emerald-800"
        >
          ← カテゴリ別表示へ戻る
        </Link>
      </div>

      <section className="rounded-2xl border border-emerald-100 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">
          新しいカテゴリを追加
        </h2>
        <form action={createCategory} className="flex flex-wrap items-end gap-4">
          <label className="min-w-[200px] flex-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              カテゴリ名
            </span>
            <input name="name" required className={inputClass} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">
              色
            </span>
            <input
              type="color"
              name="color"
              defaultValue="#059669"
              className="h-[38px] w-16 rounded-md border border-emerald-200"
            />
          </label>
          <SubmitButton>追加する</SubmitButton>
        </form>
      </section>

      <section className="space-y-3">
        {categories.map((category) => {
          const updateCategoryWithId = updateCategory.bind(null, category.id);
          const deleteCategoryWithId = deleteCategory.bind(null, category.id);
          return (
            <div
              key={category.id}
              className="flex flex-wrap items-end gap-4 rounded-xl border border-emerald-100 bg-white p-4"
            >
              <form
                action={updateCategoryWithId}
                className="flex flex-1 flex-wrap items-end gap-4"
              >
                <label className="min-w-[200px] flex-1">
                  <span className="mb-1 block text-xs font-medium text-slate-500">
                    カテゴリ名
                  </span>
                  <input
                    name="name"
                    defaultValue={category.name}
                    required
                    className={inputClass}
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs font-medium text-slate-500">
                    色
                  </span>
                  <input
                    type="color"
                    name="color"
                    defaultValue={category.color}
                    className="h-[38px] w-16 rounded-md border border-emerald-200"
                  />
                </label>
                <SubmitButton>保存</SubmitButton>
              </form>
              <ConfirmForm
                action={deleteCategoryWithId}
                confirmMessage={`「${category.name}」を削除しますか？このカテゴリを使用している作業は未分類になります。`}
              >
                削除
              </ConfirmForm>
            </div>
          );
        })}
        {categories.length === 0 ? (
          <p className="rounded-xl border border-emerald-100 bg-white p-6 text-center text-slate-500">
            カテゴリがまだありません。
          </p>
        ) : null}
      </section>
    </div>
  );
}

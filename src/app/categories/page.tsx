import Link from "next/link";
import { getCategorySummaries } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const summaries = await getCategorySummaries();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">カテゴリ別表示</h1>
        <Link
          href="/categories/manage"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          カテゴリを管理 →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaries.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-semibold text-slate-900">
                {category.name}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {category.incompleteCount}
              </span>
              <span className="text-sm text-slate-500">
                件が対応中 / 全{category.totalCount}件
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

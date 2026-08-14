import Link from "next/link";
import { getProjectSummaries } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const summaries = await getProjectSummaries();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">プロジェクト別表示</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaries.map((project) => (
          <Link
            key={project.name}
            href={`/projects/${encodeURIComponent(project.name)}`}
            className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="font-semibold text-slate-900">
              {project.name}
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {project.incompleteCount}
              </span>
              <span className="text-sm text-slate-500">
                件が対応中 / 全{project.totalCount}件
              </span>
            </div>
          </Link>
        ))}
        {summaries.length === 0 ? (
          <p className="col-span-full rounded-xl border border-emerald-100 bg-white p-8 text-center text-slate-500">
            プロジェクトがまだありません。
          </p>
        ) : null}
      </div>
    </div>
  );
}

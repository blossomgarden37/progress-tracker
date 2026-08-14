import Link from "next/link";
import { getStatusSummaries } from "@/lib/data";
import { StatusBadge } from "@/components/tasks/StatusBadge";

export const dynamic = "force-dynamic";

export default async function StatusesPage() {
  const summaries = await getStatusSummaries();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">ステータス別表示</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaries.map((summary) => (
          <Link
            key={summary.status}
            href={`/statuses/${summary.status}`}
            className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <StatusBadge status={summary.status} />
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {summary.totalCount}
              </span>
              <span className="text-sm text-slate-500">件</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

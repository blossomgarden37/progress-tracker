"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { STATUS_LABELS, TASK_STATUSES, type Category } from "@/lib/types";

export function TaskFilters({
  categories,
  assignees,
  projectNames,
  propertyNames,
}: {
  categories: Category[];
  assignees: string[];
  projectNames: string[];
  propertyNames: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col rounded-xl border border-emerald-100 bg-white p-5">
      <div className="space-y-4">
        <FilterSelect
          label="ステータス"
          value={searchParams.get("status") ?? ""}
          onChange={(v) => updateParam("status", v)}
          options={[
            { value: "", label: "すべて（未完了）" },
            ...TASK_STATUSES.filter((s) => s !== "completed").map((s) => ({
              value: s,
              label: STATUS_LABELS[s],
            })),
          ]}
        />
        <FilterSelect
          label="プロジェクト"
          value={searchParams.get("project") ?? ""}
          onChange={(v) => updateParam("project", v)}
          options={[
            { value: "", label: "すべて" },
            ...projectNames.map((p) => ({ value: p, label: p })),
          ]}
        />
        <FilterSelect
          label="件名"
          value={searchParams.get("property") ?? ""}
          onChange={(v) => updateParam("property", v)}
          options={[
            { value: "", label: "すべて" },
            ...propertyNames.map((p) => ({ value: p, label: p })),
          ]}
        />
        <FilterSelect
          label="カテゴリ"
          value={searchParams.get("category") ?? ""}
          onChange={(v) => updateParam("category", v)}
          options={[
            { value: "", label: "すべて" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <FilterSelect
          label="担当者"
          value={searchParams.get("assignee") ?? ""}
          onChange={(v) => updateParam("assignee", v)}
          options={[
            { value: "", label: "すべて" },
            ...assignees.map((a) => ({ value: a, label: a })),
          ]}
        />
      </div>

      <div className="mt-6 border-t border-emerald-100 pt-4">
        <FilterSelect
          label="並び替え"
          value={searchParams.get("sort") ?? "due_date"}
          onChange={(v) => updateParam("sort", v)}
          options={[
            { value: "due_date", label: "期限が近い順" },
            { value: "input_date", label: "入力日が新しい順" },
            { value: "assignee", label: "担当者順" },
          ]}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold text-emerald-700/70">
        {label}
      </span>
      <select
        className="w-full rounded-md border border-emerald-200 bg-white px-2 py-1.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

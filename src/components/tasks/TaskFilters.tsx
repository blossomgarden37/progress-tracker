"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { STATUS_LABELS, TASK_STATUSES, type Category } from "@/lib/types";

export function TaskFilters({
  categories,
  assignees,
}: {
  categories: Category[];
  assignees: string[];
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
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-blue-100 bg-white p-4">
      <FilterSelect
        label="ステータス"
        value={searchParams.get("status") ?? ""}
        onChange={(v) => updateParam("status", v)}
        options={[
          { value: "", label: "すべて" },
          ...TASK_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
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
    <label className="flex items-center gap-2 text-sm text-blue-900">
      {label}
      <select
        className="rounded-md border border-blue-200 bg-white px-2 py-1.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
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

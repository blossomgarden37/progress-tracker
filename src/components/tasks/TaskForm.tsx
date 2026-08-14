"use client";

import type { ReactNode } from "react";
import {
  PRIORITY_LABELS,
  PRIORITY_LEVELS,
  STATUS_LABELS,
  TASK_STATUSES,
  type Category,
  type Task,
} from "@/lib/types";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/Button";

const inputClass =
  "w-full rounded-md border border-emerald-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-emerald-900">
        {label}
        {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
      </span>
      {children}
    </label>
  );
}

export function TaskForm({
  categories,
  task,
  action,
}: {
  categories: Category[];
  task?: Partial<Task>;
  action: (formData: FormData) => void;
}) {
  return (
    <form
      action={action}
      className="space-y-6 rounded-2xl border border-emerald-100 bg-white p-6"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="プロジェクト名" required>
          <input
            name="project_name"
            defaultValue={task?.project_name}
            required
            className={inputClass}
          />
        </Field>
        <Field label="物件名">
          <input
            name="property_name"
            defaultValue={task?.property_name ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Badge No">
          <input
            name="batch_no"
            defaultValue={task?.batch_no ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="カテゴリ">
          <select
            name="category_id"
            defaultValue={task?.category_id ?? ""}
            className={inputClass}
          >
            <option value="">未分類</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="担当者" required>
          <input
            name="assignee"
            defaultValue={task?.assignee}
            required
            className={inputClass}
          />
        </Field>
        <Field label="ステータス">
          <select
            name="status"
            defaultValue={task?.status ?? "not_started"}
            className={inputClass}
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="優先度">
          <select
            name="priority"
            defaultValue={task?.priority ?? "medium"}
            className={inputClass}
          >
            {PRIORITY_LEVELS.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="入力日付">
          <input
            type="date"
            name="input_date"
            defaultValue={task?.input_date}
            className={inputClass}
          />
        </Field>
        <Field label="期限" required>
          <input
            type="date"
            name="due_date"
            defaultValue={task?.due_date}
            required
            className={inputClass}
          />
        </Field>
        <Field label="処理完了日">
          <input
            type="date"
            name="completed_date"
            defaultValue={task?.completed_date ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="再対応">
          <label className="flex h-[38px] items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="needs_rework"
              defaultChecked={task?.needs_rework}
              className="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
            />
            要再対応としてマークする
          </label>
        </Field>
      </div>
      <Field label="備考">
        <textarea
          name="notes"
          defaultValue={task?.notes ?? ""}
          rows={3}
          className={inputClass}
        />
      </Field>
      <div className="flex justify-end gap-3 border-t border-emerald-100 pt-4">
        <Button href="/" variant="secondary">
          キャンセル
        </Button>
        <SubmitButton>{task?.id ? "更新する" : "登録する"}</SubmitButton>
      </div>
    </form>
  );
}

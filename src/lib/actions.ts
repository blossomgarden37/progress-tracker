"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseClient } from "./supabase";
import type { TaskStatus } from "./types";

function parseTaskForm(formData: FormData) {
  const categoryId = formData.get("category_id");
  return {
    category_id: categoryId ? String(categoryId) : null,
    project_name: String(formData.get("project_name") ?? "").trim(),
    property_name: String(formData.get("property_name") ?? "").trim() || null,
    batch_no: String(formData.get("batch_no") ?? "").trim() || null,
    assignee: String(formData.get("assignee") ?? "").trim(),
    input_date: String(formData.get("input_date") ?? ""),
    due_date: String(formData.get("due_date") ?? ""),
    completed_date: String(formData.get("completed_date") ?? "") || null,
    status: String(formData.get("status") ?? "not_started") as TaskStatus,
    needs_rework: formData.get("needs_rework") === "on",
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

export async function createTask(formData: FormData) {
  const values = parseTaskForm(formData);
  if (!values.project_name || !values.assignee || !values.due_date) {
    throw new Error("プロジェクト名・担当者・期限は必須です。");
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.from("tasks").insert(values);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/");
}

export async function updateTask(id: string, formData: FormData) {
  const values = parseTaskForm(formData);
  if (!values.project_name || !values.assignee || !values.due_date) {
    throw new Error("プロジェクト名・担当者・期限は必須です。");
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.from("tasks").update(values).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/");
}

export async function deleteTask(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/");
}

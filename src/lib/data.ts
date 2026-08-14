import { getSupabaseClient } from "./supabase";
import {
  TASK_STATUSES,
  type Category,
  type Task,
  type TaskStatus,
  type TaskWithCategory,
} from "./types";

export interface TaskFilters {
  status?: TaskStatus;
  categoryId?: string;
  assignee?: string;
  projectName?: string;
  propertyName?: string;
  sort?: "due_date" | "input_date" | "assignee";
  /** ステータスが未指定のとき、完了済みタスクを除外する（TOP画面の「未完了案件」用） */
  onlyIncomplete?: boolean;
}

function attachCategory(
  tasks: Task[],
  categories: Category[],
): TaskWithCategory[] {
  const byId = new Map(categories.map((c) => [c.id, c]));
  return tasks.map((task) => ({
    ...task,
    category: task.category_id ? (byId.get(task.category_id) ?? null) : null,
  }));
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as Category[];
}

export async function getTasks(
  filters: TaskFilters = {},
): Promise<TaskWithCategory[]> {
  const supabase = getSupabaseClient();
  let query = supabase.from("tasks").select("*");

  if (filters.status) query = query.eq("status", filters.status);
  // onlyIncomplete はステータス選択の有無に関わらず常に完了済みを除外する
  // （作業進捗一覧では完了案件を一切表示しないため。完了済みの確認は
  // 別ページ /completed で行う）。
  if (filters.onlyIncomplete) query = query.neq("status", "completed");
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.assignee) query = query.eq("assignee", filters.assignee);
  if (filters.projectName) query = query.eq("project_name", filters.projectName);
  if (filters.propertyName)
    query = query.eq("property_name", filters.propertyName);

  const sortColumn = filters.sort ?? "due_date";
  const ascending = sortColumn !== "input_date";
  query = query.order(sortColumn, { ascending });

  const [{ data, error }, categories] = await Promise.all([
    query,
    getCategories(),
  ]);
  if (error) throw error;
  return attachCategory(data as Task[], categories);
}

export async function getTaskById(id: string): Promise<TaskWithCategory | null> {
  const supabase = getSupabaseClient();
  const [{ data, error }, categories] = await Promise.all([
    supabase.from("tasks").select("*").eq("id", id).maybeSingle(),
    getCategories(),
  ]);
  if (error) throw error;
  if (!data) return null;
  return attachCategory([data as Task], categories)[0];
}

async function getDistinctColumnValues(
  column: "assignee" | "project_name" | "property_name",
): Promise<string[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("tasks").select(column);
  if (error) throw error;
  const set = new Set(
    (data as Record<string, string | null>[])
      .map((row) => row[column])
      .filter((value): value is string => Boolean(value)),
  );
  return Array.from(set).sort();
}

export function getDistinctAssignees(): Promise<string[]> {
  return getDistinctColumnValues("assignee");
}

export function getDistinctProjectNames(): Promise<string[]> {
  return getDistinctColumnValues("project_name");
}

export function getDistinctPropertyNames(): Promise<string[]> {
  return getDistinctColumnValues("property_name");
}

export interface CategorySummary extends Category {
  totalCount: number;
  incompleteCount: number;
}

export async function getCategorySummaries(): Promise<CategorySummary[]> {
  const supabase = getSupabaseClient();
  const [categories, { data, error }] = await Promise.all([
    getCategories(),
    supabase.from("tasks").select("category_id, status"),
  ]);
  if (error) throw error;

  const rows = data as { category_id: string | null; status: TaskStatus }[];
  return categories.map((category) => {
    const rowsForCategory = rows.filter((r) => r.category_id === category.id);
    return {
      ...category,
      totalCount: rowsForCategory.length,
      incompleteCount: rowsForCategory.filter((r) => r.status !== "completed")
        .length,
    };
  });
}

export interface ProjectSummary {
  name: string;
  totalCount: number;
  incompleteCount: number;
}

export async function getProjectSummaries(): Promise<ProjectSummary[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("project_name, status");
  if (error) throw error;

  const rows = data as { project_name: string; status: TaskStatus }[];
  const summaries = new Map<string, ProjectSummary>();
  for (const row of rows) {
    const existing = summaries.get(row.project_name) ?? {
      name: row.project_name,
      totalCount: 0,
      incompleteCount: 0,
    };
    existing.totalCount += 1;
    if (row.status !== "completed") existing.incompleteCount += 1;
    summaries.set(row.project_name, existing);
  }
  return Array.from(summaries.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "ja"),
  );
}

export interface StatusSummary {
  status: TaskStatus;
  totalCount: number;
}

export async function getStatusSummaries(): Promise<StatusSummary[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("tasks").select("status");
  if (error) throw error;

  const rows = data as { status: TaskStatus }[];
  return TASK_STATUSES.map((status) => ({
    status,
    totalCount: rows.filter((r) => r.status === status).length,
  }));
}

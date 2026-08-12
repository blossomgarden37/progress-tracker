import { getSupabaseClient } from "./supabase";
import type { Category, Task, TaskStatus, TaskWithCategory } from "./types";

export interface TaskFilters {
  status?: TaskStatus;
  categoryId?: string;
  assignee?: string;
  sort?: "due_date" | "input_date" | "assignee";
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
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.assignee) query = query.eq("assignee", filters.assignee);

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

export async function getMostUrgentTask(): Promise<TaskWithCategory | null> {
  const supabase = getSupabaseClient();
  const [{ data, error }, categories] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .neq("status", "completed")
      .order("due_date", { ascending: true })
      .limit(1),
    getCategories(),
  ]);
  if (error) throw error;
  const tasks = attachCategory(data as Task[], categories);
  return tasks[0] ?? null;
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

export async function getDistinctAssignees(): Promise<string[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("tasks").select("assignee");
  if (error) throw error;
  const set = new Set((data as { assignee: string }[]).map((t) => t.assignee));
  return Array.from(set).sort();
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

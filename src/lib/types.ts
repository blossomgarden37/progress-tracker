export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "on_hold"
  | "needs_rework"
  | "completed";

export const TASK_STATUSES: TaskStatus[] = [
  "not_started",
  "in_progress",
  "on_hold",
  "needs_rework",
  "completed",
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: "未着手",
  in_progress: "進行中",
  on_hold: "保留中",
  needs_rework: "再対応",
  completed: "完了",
};

export interface Category {
  id: string;
  name: string;
  color: string;
  sort_order: number;
  created_at: string;
}

export interface Task {
  id: string;
  category_id: string | null;
  project_name: string;
  property_name: string | null;
  batch_no: string | null;
  assignee: string;
  input_date: string;
  due_date: string;
  completed_date: string | null;
  status: TaskStatus;
  needs_rework: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskWithCategory extends Task {
  category: Category | null;
}

export type TaskFormValues = {
  category_id: string;
  project_name: string;
  property_name: string;
  batch_no: string;
  assignee: string;
  input_date: string;
  due_date: string;
  completed_date: string;
  status: TaskStatus;
  needs_rework: boolean;
  notes: string;
};

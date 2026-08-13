import { Badge } from "@/components/ui/Badge";
import { STATUS_LABELS, type TaskStatus } from "@/lib/types";

const STATUS_CLASS: Record<TaskStatus, string> = {
  not_started:
    "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-600/15",
  in_progress: "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-600/20",
  on_hold: "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  needs_rework: "bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  completed:
    "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge className={STATUS_CLASS[status]}>{STATUS_LABELS[status]}</Badge>
  );
}

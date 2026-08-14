import { clsx } from "clsx";
import { PRIORITY_LABELS, type PriorityLevel } from "@/lib/types";

// 矢印の角度で優先度を表現する: 上向き=高(オレンジ) / 横向き=中(グリーン) / 下向き=低(ブルー)
const PRIORITY_ROTATION: Record<PriorityLevel, string> = {
  high: "-rotate-90",
  medium: "rotate-0",
  low: "rotate-90",
};

const PRIORITY_COLOR: Record<PriorityLevel, string> = {
  high: "text-orange-500",
  medium: "text-emerald-600",
  low: "text-blue-500",
};

export function PriorityIcon({ priority }: { priority: PriorityLevel }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center",
        PRIORITY_COLOR[priority],
      )}
      title={`優先度: ${PRIORITY_LABELS[priority]}`}
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clsx("h-4 w-4", PRIORITY_ROTATION[priority])}
        aria-hidden="true"
      >
        <path d="M4 10h11M10 5l5 5-5 5" />
      </svg>
      <span className="sr-only">{PRIORITY_LABELS[priority]}</span>
    </span>
  );
}

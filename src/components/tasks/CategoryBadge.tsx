import { Badge } from "@/components/ui/Badge";
import type { Category } from "@/lib/types";

export function CategoryBadge({ category }: { category: Category | null }) {
  if (!category) {
    return <span className="text-xs text-slate-400">未分類</span>;
  }
  return (
    <Badge
      style={{
        backgroundColor: `${category.color}1a`,
        color: category.color,
        boxShadow: `inset 0 0 0 1px ${category.color}40`,
      }}
    >
      {category.name}
    </Badge>
  );
}

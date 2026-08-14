import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="border-b border-emerald-100 bg-white">
      <div className="flex items-center justify-between px-[clamp(1rem,5vw,6.25rem)] py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-emerald-900"
        >
          progress-tracker
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-emerald-700">
          <Link href="/" className="hover:text-emerald-900">
            一覧
          </Link>
          <Link href="/categories" className="hover:text-emerald-900">
            カテゴリ別
          </Link>
          <Link href="/projects" className="hover:text-emerald-900">
            プロジェクト別
          </Link>
          <Link href="/statuses" className="hover:text-emerald-900">
            ステータス別
          </Link>
          <Link href="/completed" className="hover:text-emerald-900">
            完了済み
          </Link>
          <Button href="/tasks/new" className="ml-2">
            + 新規登録
          </Button>
        </nav>
      </div>
    </header>
  );
}

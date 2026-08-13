import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="border-b border-blue-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-blue-900">
          progress-tracker
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-blue-700">
          <Link href="/" className="hover:text-blue-900">
            一覧
          </Link>
          <Link href="/categories" className="hover:text-blue-900">
            カテゴリ別
          </Link>
          <Button href="/tasks/new" className="ml-2">
            + 新規登録
          </Button>
        </nav>
      </div>
    </header>
  );
}

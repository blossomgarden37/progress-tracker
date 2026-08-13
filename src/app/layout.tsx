import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "progress-tracker",
  description: "プロジェクトの進捗を見える化する進捗管理ツール",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${notoSansJp.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-emerald-50 font-sans text-slate-900">
        <Header />
        <main className="w-full flex-1 px-[100px] py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

# progress-tracker

プロジェクトの進捗状況を可視化し、期限間近の作業を見逃さないための進捗管理ツールです。詳細な仕様・DB設計・開発方針は [CLAUDE.md](./CLAUDE.md) を参照してください。

## セットアップ

1. 依存関係をインストール

   ```bash
   npm install
   ```

2. Supabaseプロジェクトを用意し、SQL Editorで [supabase/migrations/0001_init.sql](./supabase/migrations/0001_init.sql) を実行してテーブルを作成する。

3. `.env.local.example` を `.env.local` にコピーし、SupabaseプロジェクトのURLとanon keyを設定する。

   ```bash
   cp .env.local.example .env.local
   ```

4. 開発サーバーを起動

   ```bash
   npm run dev
   ```

   [http://localhost:3000](http://localhost:3000) を開く。

## 主な画面

- `/` — メイン画面。期限が最も近い未完了作業を強調表示し、下に一覧・フィルタを表示する。
- `/tasks/new` — 新規登録画面。
- `/tasks/[id]/edit` — 編集・削除画面。
- `/categories` — カテゴリ一覧（件数付き）。
- `/categories/[categoryId]` — カテゴリ別の作業一覧。

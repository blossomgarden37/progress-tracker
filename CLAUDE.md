@AGENTS.md

# progress-tracker

## 1. プロジェクト概要

- **目的**: プロジェクト（案件）の進捗状況を可視化し、「進捗が見えないことによる未完了作業の見落とし・手戻り」を防ぐための進捗管理ツール。
- **対象ユーザー**: 現フェーズはオーナー本人のみの個人利用。将来的にプロジェクトに関わる他メンバーへの展開を想定。
- **コアとなる課題**: 進捗が見える化されておらず、未完了の作業に気づけず、手戻り（やり直し）が発生してしまう。
- **ゴール**: スタートからゴールまでの進捗の達成度合いを一覧・カテゴリ単位で把握できるようにする。特に「期限が近い作業」を見逃さないことを最優先の価値とする。

## 2. 技術スタック

- **フレームワーク**: Next.js（App Router / TypeScript / React Server Components + Server Actions）
- **スタイリング**: Tailwind CSS
- **DB / BaaS**: Supabase（PostgreSQL）
  - クライアント: `@supabase/supabase-js`
  - 現フェーズは Supabase Auth 未使用（[3. セキュリティ・認証方針](#3-セキュリティ認証方針) を参照）
- **ホスティング想定**: Vercel（フロント）+ Supabase（DB）
- **パッケージ管理**: npm

## 3. セキュリティ・認証方針

- **現フェーズのスコープ**: 自分専用・認証なし。`tasks` / `categories` テーブルは Row Level Security (RLS) を有効化した上で、`anon` ロールに対して全操作を許可するポリシーとしている（[supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql)）。個人利用かつオーナーのみが接続情報を保持する前提でのみ許容される暫定構成であり、これは意図的なスコープ限定であって実装漏れではない。
- **将来の拡張方針**（設計図「Future Scaling: セキュリティを加味してオンラインでもオフラインでも使用できるツール」に対応）:
  1. Supabase Auth（メール/パスワード or マジックリンク）を導入し、ログインを必須化する。
  2. `tasks` テーブルに `user_id uuid references auth.users` を追加し、RLS ポリシーを `anon` 全許可から `auth.uid() = user_id` ベースの本人限定アクセスへ置き換える。
  3. 複数メンバー展開時は、プロジェクト単位のメンバーシップテーブル（例: `project_members`）を追加し、所属プロジェクトの範囲でのみ読み書きを許可する設計に拡張する。
  4. オフライン対応（PWA化 / ローカルキャッシュ同期）を検討する際も、認証トークンの安全な保管（Secure Storage）とオンライン復帰時の競合解決方針をあわせて設計すること。
  - 認証を追加するタイミングで、このセクションと `supabase/migrations` に新しいマイグレーションを追記し、暫定ポリシーを更新すること。

## 4. 環境変数の扱い

- 実際の接続情報は `.env.local`（gitignore 対象）にのみ記載し、絶対にコミットしない。
- リポジトリには `.env.local.example` のみを含め、プレースホルダー値のみを記載する。
- `.gitignore` は `.env*` を除外しつつ `!.env*.example` で example ファイルだけを例外的にコミット対象としている。新しい env ファイルを追加する場合もこの方針を踏襲すること。
- `NEXT_PUBLIC_` プレフィックスの環境変数はクライアントに露出する前提のため、Supabaseの `anon key`（公開を前提とした鍵。RLSで保護する）以外の秘密情報（service role key 等）をこのプレフィックスで扱わないこと。

## 5. ディレクトリ構成

```
progress-tracker/
├── .env.local.example        # 環境変数のプレースホルダー（実値は .env.local に）
├── supabase/
│   └── migrations/
│       └── 0001_init.sql     # 初期スキーマ（categories, tasks, RLS）
└── src/
    ├── app/
    │   ├── layout.tsx        # 共通レイアウト・ヘッダーナビ
    │   ├── page.tsx           # メイン画面（期限バナー + 一覧 + フィルタ）
    │   ├── tasks/
    │   │   ├── new/page.tsx        # 新規登録（入力画面）
    │   │   └── [id]/edit/page.tsx  # 編集画面
    │   └── categories/
    │       ├── page.tsx            # カテゴリ一覧（件数付き）
    │       ├── manage/page.tsx     # カテゴリ管理（追加・編集・削除）
    │       └── [categoryId]/page.tsx # カテゴリ別の作業一覧
    ├── components/
    │   ├── ui/                # Badge, Button, ConfirmForm など汎用UI
    │   ├── layout/             # Header など
    │   └── tasks/              # DeadlineBanner, TaskTable, TaskForm, TaskFilters, StatusBadge
    └── lib/
        ├── supabase.ts        # Supabaseクライアント生成
        ├── types.ts           # Task / Category の型、ステータス定義
        ├── data.ts             # 一覧取得・フィルタ・最優先タスク取得などの読み取り処理
        ├── actions.ts           # createTask/updateTask/deleteTask, createCategory/updateCategory/deleteCategory（Server Actions）
        └── urgency.ts           # 期限までの日数 → 緊急度レベル・配色ロジック
```

## 6. DB設計

### categories（カテゴリマスタ）

| カラム | 型 | 説明 |
|---|---|---|
| id | uuid (PK) | |
| name | text (unique) | カテゴリ名 |
| color | text | バッジ表示用のカラーコード |
| sort_order | integer | 表示順 |
| created_at | timestamptz | |

### tasks（進捗レコード）

設計図の「Data Items」に基づき、以下のカラムを持つ。

| カラム | 型 | 説明 |
|---|---|---|
| id | uuid (PK) | |
| category_id | uuid (FK → categories, nullable) | カテゴリ別表示に使用 |
| project_name | text (必須) | プロジェクト名 |
| property_name | text | 物件名 |
| batch_no | text | Badge No |
| assignee | text (必須) | 担当者 |
| input_date | date | 入力日付（デフォルト: 当日） |
| due_date | date (必須) | 期限。メイン画面の「期限間近」表示のソート基準 |
| completed_date | date, nullable | 処理完了日 |
| status | enum task_status | `not_started`(未着手) / `in_progress`(進行中) / `on_hold`(保留中) / `needs_rework`(再対応) / `completed`(完了) |
| needs_rework | boolean | 再対応フラグ（一覧での強調表示に使用） |
| notes | text | 備考 |
| created_at / updated_at | timestamptz | `updated_at` はトリガーで自動更新 |

- 「保留中」「再対応」は当初 個別カラムでの要望だったが、手作業の運用手順（ステータスは同時に1つ）に合わせて `status` enum に統合し、視認性を上げている。`needs_rework` は再対応が発生した際の履歴的なフラグとして別途保持。
- 緊急度（色分け）は DB に保持せず、`due_date` と `status` から `src/lib/urgency.ts` でリアルタイムに算出する（マスタデータの二重管理を避けるため）。

## 7. 開発方針

- **データ取得/更新**: 一覧取得など読み取りは Server Component から `lib/data.ts` を通じて行い、作成・更新・削除は Server Actions（`lib/actions.ts`、`"use server"`）に集約する。クライアントコンポーネントは操作が必要な箇所（フォーム・フィルタ）のみに限定する。
- **デザイントーン**: 「清潔感のある洗練されたデザイン」を基準に、ベースカラー・ボタン・タグはTailwind CSSのblue系トーンで統一する。期限の緊急度（`src/lib/urgency.ts`）とステータスの一部（保留中=amber、再対応=rose、完了=emerald）のみ意図的にblue系以外の警告色を用いて目立たせ、それ以外の装飾的な配色は避ける。カテゴリバッジの色はカテゴリごとにユーザーが設定する値（`categories.color`）をそのまま使うため、この統一ルールの対象外。
- **命名規則**: DBカラムは snake_case、TypeScript側はプロパティ名をDBに合わせて snake_case のまま扱う（型変換レイヤーを増やさずシンプルに保つ）。コンポーネント・関数は既存の Next.js/React 標準（PascalCase コンポーネント、camelCase 関数）に従う。
- **スコープ管理**: 「まずは自分専用」「まずはテキスト情報のみ」という設計図の明言に従い、認証・ファイル添付・複数ユーザー機能は実装しない。将来追加する場合は本ファイルの該当セクションを更新してから着手する。
- **マイグレーション**: スキーマ変更は `supabase/migrations/NNNN_*.sql` に追記する形で管理し、既存マイグレーションの内容は変更しない。

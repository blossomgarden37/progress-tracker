-- progress-tracker: 初期スキーマ
-- 対象: categories, tasks
-- 現状は認証なし・個人利用のスコープのため anon ロールに全権限を許可している。
-- 将来ユーザー認証を追加する際は tasks に user_id 列を足し、
-- ポリシーを auth.uid() ベースの制御に置き換えること。

create extension if not exists "pgcrypto";

create type task_status as enum (
  'not_started',  -- 未着手
  'in_progress',  -- 進行中
  'on_hold',      -- 保留中
  'needs_rework', -- 再対応
  'completed'     -- 完了
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#64748b',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories (id) on delete set null,
  project_name text not null,
  property_name text,
  batch_no text,
  assignee text not null,
  input_date date not null default current_date,
  due_date date not null,
  completed_date date,
  status task_status not null default 'not_started',
  needs_rework boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_due_date_idx on tasks (due_date);
create index tasks_status_idx on tasks (status);
create index tasks_category_id_idx on tasks (category_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tasks_set_updated_at
before update on tasks
for each row execute function set_updated_at();

alter table categories enable row level security;
alter table tasks enable row level security;

create policy "anon full access (categories)" on categories
  for all using (true) with check (true);

create policy "anon full access (tasks)" on tasks
  for all using (true) with check (true);

insert into categories (name, color, sort_order) values
  ('データ入力', '#2563eb', 1),
  ('検品', '#d97706', 2),
  ('契約書関連', '#059669', 3),
  ('その他', '#64748b', 99);

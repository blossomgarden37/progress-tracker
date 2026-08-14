-- tasks に優先度（priority）を追加
-- high(高) / medium(中) / low(低) の3段階。既存行は default 'medium' で補完される。

create type task_priority as enum ('high', 'medium', 'low');

alter table tasks
  add column priority task_priority not null default 'medium';

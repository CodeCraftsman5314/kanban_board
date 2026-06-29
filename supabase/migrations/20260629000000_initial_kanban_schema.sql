-- Initial Kanban schema.
-- This migration replaces the previous manual Supabase SQL Editor setup.

create table public.columns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid references public.columns(id) on delete cascade,
  title text not null,
  description text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  label text,
  priority text not null default 'none',
  due_date date,
  subtasks jsonb not null default '[]'::jsonb
);

alter table public.columns enable row level security;
alter table public.cards enable row level security;

create policy "Public read columns" on public.columns for select using (true);
create policy "Public write columns" on public.columns for all using (true);
create policy "Public read cards" on public.cards for select using (true);
create policy "Public write cards" on public.cards for all using (true);

alter publication supabase_realtime add table public.columns;
alter publication supabase_realtime add table public.cards;

insert into public.columns (title, "order") values
  ('To Do', 0),
  ('In Progress', 1),
  ('Done', 2);

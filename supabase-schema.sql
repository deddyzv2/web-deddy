create table if not exists public.tone_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  project jsonb not null default '{}'::jsonb,
  tones jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brainstorming_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  idea jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tone_templates_updated_at on public.tone_templates;
create trigger set_tone_templates_updated_at
before update on public.tone_templates
for each row execute function public.set_updated_at();

drop trigger if exists set_brainstorming_ideas_updated_at on public.brainstorming_ideas;
create trigger set_brainstorming_ideas_updated_at
before update on public.brainstorming_ideas
for each row execute function public.set_updated_at();

alter table public.tone_templates enable row level security;
alter table public.brainstorming_ideas enable row level security;

drop policy if exists "tone_templates_select_own" on public.tone_templates;
create policy "tone_templates_select_own"
on public.tone_templates
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "tone_templates_insert_own" on public.tone_templates;
create policy "tone_templates_insert_own"
on public.tone_templates
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "tone_templates_update_own" on public.tone_templates;
create policy "tone_templates_update_own"
on public.tone_templates
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "tone_templates_delete_own" on public.tone_templates;
create policy "tone_templates_delete_own"
on public.tone_templates
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "brainstorming_ideas_select_own" on public.brainstorming_ideas;
create policy "brainstorming_ideas_select_own"
on public.brainstorming_ideas
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "brainstorming_ideas_insert_own" on public.brainstorming_ideas;
create policy "brainstorming_ideas_insert_own"
on public.brainstorming_ideas
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "brainstorming_ideas_update_own" on public.brainstorming_ideas;
create policy "brainstorming_ideas_update_own"
on public.brainstorming_ideas
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "brainstorming_ideas_delete_own" on public.brainstorming_ideas;
create policy "brainstorming_ideas_delete_own"
on public.brainstorming_ideas
for delete
to authenticated
using (auth.uid() = user_id);

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  notes text,
  priority text not null default 'Sedang',
  is_done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_todos_updated_at on public.todos;
create trigger set_todos_updated_at
before update on public.todos
for each row execute function public.set_updated_at();

alter table public.todos enable row level security;

drop policy if exists "todos_select_own" on public.todos;
create policy "todos_select_own"
on public.todos
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "todos_insert_own" on public.todos;
create policy "todos_insert_own"
on public.todos
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "todos_update_own" on public.todos;
create policy "todos_update_own"
on public.todos
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "todos_delete_own" on public.todos;
create policy "todos_delete_own"
on public.todos
for delete
to authenticated
using (auth.uid() = user_id);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_notes_updated_at on public.notes;
create trigger set_notes_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

alter table public.notes enable row level security;

drop policy if exists "notes_select_own" on public.notes;
create policy "notes_select_own"
on public.notes
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "notes_insert_own" on public.notes;
create policy "notes_insert_own"
on public.notes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "notes_update_own" on public.notes;
create policy "notes_update_own"
on public.notes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "notes_delete_own" on public.notes;
create policy "notes_delete_own"
on public.notes
for delete
to authenticated
using (auth.uid() = user_id);

-- Claude-Code-Arbeitszeit: wird vom Hook auf dem PC befüllt (siehe CLAUDE-CODE.md)
create table if not exists claude_sessions (
  id          text primary key,
  user_id     uuid not null references auth.users on delete cascade,
  session_id  text not null,
  project     text,
  cwd         text,
  started_at  timestamptz not null,
  ended_at    timestamptz not null,
  seconds     integer not null default 0,
  running     boolean not null default false,
  updated_at  timestamptz not null default now()
);

create index if not exists claude_sessions_user_started on claude_sessions (user_id, started_at desc);

alter table claude_sessions enable row level security;

create policy "own claude - select" on claude_sessions
  for select using (auth.uid() = user_id);
create policy "own claude - insert" on claude_sessions
  for insert with check (auth.uid() = user_id);
create policy "own claude - update" on claude_sessions
  for update using (auth.uid() = user_id);
create policy "own claude - delete" on claude_sessions
  for delete using (auth.uid() = user_id);

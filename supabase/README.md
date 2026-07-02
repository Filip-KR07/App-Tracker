# Supabase-Setup

## Datenbank

Tabelle `tracker_state` mit Row-Level-Security. Falls noch nicht vorhanden,
im SQL-Editor ausführen:

```sql
create table if not exists tracker_state (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table tracker_state enable row level security;

create policy "own row - select" on tracker_state
  for select using (auth.uid() = user_id);
create policy "own row - insert" on tracker_state
  for insert with check (auth.uid() = user_id);
create policy "own row - update" on tracker_state
  for update using (auth.uid() = user_id);
-- Für die "Konto löschen"-Funktion (Fallback ohne Edge Function):
create policy "own row - delete" on tracker_state
  for delete using (auth.uid() = user_id);
```

> `on delete cascade` sorgt dafür, dass beim Löschen des Auth-Users
> (durch die Edge Function) auch die Datenzeile automatisch verschwindet.

## Edge Function: delete-account

Löscht Konto + Daten endgültig (Apple-Pflicht 5.1.1v).

```bash
# Einmalig
npm install -g supabase
supabase login
supabase link --project-ref DEIN_PROJECT_REF

# Deploy
supabase functions deploy delete-account
```

Die benötigten Secrets (`SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`) stellt Supabase automatisch bereit.

Danach ruft die App den Endpunkt
`/functions/v1/delete-account` automatisch auf, wenn der Nutzer in den
Einstellungen auf **Konto löschen** tippt. Ist die Function nicht
deployt, entfernt die App nur die lokalen Daten und meldet den Nutzer ab.

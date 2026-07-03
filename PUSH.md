# Echte Push-Benachrichtigungen einrichten

Standardmäßig zeigt die App Erinnerungen nur, wenn sie **geöffnet** ist.
Für echte Server-Pushes (auch bei geschlossener App) folgende Schritte.

> **iOS-Hinweis:** Web-Push funktioniert auf dem iPhone nur, wenn die App
> über „Zum Home-Bildschirm" **installiert** ist (iOS 16.4+). In der
> Capacitor-App laufen Pushes stattdessen nativ über APNs
> (`@capacitor/push-notifications`) – separater Weg, siehe unten.

## 1. VAPID-Schlüssel erzeugen
```bash
npx web-push generate-vapid-keys
```
Ergibt einen **Public** und einen **Private Key**.

## 2. Datenbank-Tabelle anlegen
Im Supabase SQL-Editor:
```sql
create table if not exists push_subscriptions (
  endpoint text primary key,
  user_id uuid not null references auth.users on delete cascade,
  subscription jsonb not null,
  updated_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

create policy "own subs - insert" on push_subscriptions
  for insert with check (auth.uid() = user_id);
create policy "own subs - update" on push_subscriptions
  for update using (auth.uid() = user_id);
create policy "own subs - select" on push_subscriptions
  for select using (auth.uid() = user_id);
create policy "own subs - delete" on push_subscriptions
  for delete using (auth.uid() = user_id);
```

## 3. Public Key in die App eintragen
In `index.html` im **CONFIG**-Block:
```js
vapidPublicKey: '<DEIN_VAPID_PUBLIC_KEY>',
```
Sobald der Wert kein Platzhalter mehr ist, abonniert die App beim
Aktivieren der Benachrichtigungen automatisch Push und speichert die
Subscription in `push_subscriptions`.

## 4. Sende-Function deployen
```bash
supabase functions deploy send-push --no-verify-jwt
supabase secrets set \
  VAPID_PUBLIC_KEY=<public> \
  VAPID_PRIVATE_KEY=<private> \
  VAPID_SUBJECT=mailto:du@example.com
```
Test:
```bash
curl -X POST https://<projekt>.supabase.co/functions/v1/send-push \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"<uuid>","title":"Test","body":"Es funktioniert 🎉"}'
```

## 5. Zeitgesteuert versenden (optional)
`send-push` ist nur der **Versand-Baustein**. Um Deadlines / tägliche
Erinnerung / Wochenrückblick automatisch zu verschicken, brauchst du einen
Scheduler, der bestimmt *wer wann* eine Nachricht bekommt und dann
`send-push` pro Nutzer aufruft. Zwei gängige Wege:

- **pg_cron + pg_net** (in Supabase): ein SQL-Cronjob liest fällige
  Erinnerungen aus `tracker_state` und ruft `send-push` via HTTP auf.
- **Externer Cron** (z. B. GitHub Actions, cron-job.org): ruft eine
  weitere Edge Function `schedule-notifications` minütlich/stündlich auf,
  die dieselbe Logik wie `checkNotifications()` im Client serverseitig
  nachbildet.

Diese Scheduler-Logik ist projektspezifisch und noch offen – der Versand
selbst ist mit `send-push` fertig.

## Native iOS-Pushes (Capacitor)
Alternativ in der nativen App:
```bash
npm install @capacitor/push-notifications
npx cap sync
```
Dann im Apple Developer Portal einen **APNs-Key** anlegen, in Xcode die
Capability „Push Notifications" aktivieren und die Device-Tokens statt der
Web-Push-Subscriptions speichern.

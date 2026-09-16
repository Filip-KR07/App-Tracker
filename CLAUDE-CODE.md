# Claude-Code-Arbeitszeit automatisch tracken

Claude Code auf dem PC meldet jede Session an Supabase. Die App zeigt die Zeit
im Tab **Arbeit** (Karte „Claude Code") und rechnet sie in Heute/Woche und ins
Dashboard ein. Handy und iPad sehen dieselben Daten.

## 1. Tabelle anlegen (einmalig)

Im Supabase SQL-Editor den Inhalt von `supabase/claude_sessions.sql` ausführen.

## 2. Hook auf dem PC

Dateien liegen unter `~/.claude/claude-tracker/`:

- `hook.js` – das Skript, das Claude Code bei Session-Start, jedem Prompt,
  jedem Antwort-Ende und Session-Ende aufruft
- `config.json` – Zugangsdaten (siehe unten)
- `token.json`, `sessions.json`, `hook.log` – werden automatisch angelegt

In `config.json` **E-Mail und Passwort des Tracker-Kontos** eintragen
(dasselbe Konto wie in der App). Solange dort Platzhalter stehen, tut der
Hook nichts.

Die Hooks sind in `~/.claude/settings.json` unter `hooks` registriert
(SessionStart, UserPromptSubmit, Stop, SessionEnd).

## 3. Wie die Zeit berechnet wird

- Eine Session = ein Eintrag mit Projektname (Ordnername des Projekts).
- Die Dauer läuft vom ersten bis zum letzten Hook-Ereignis.
- Nach mehr als 30 Minuten Pause beginnt ein neues Zeitsegment, damit eine
  offen gelassene Session nicht die ganze Nacht zählt.
- Solange ein Ereignis weniger als 30 Minuten her ist, gilt die Session in
  der App als „läuft".

## Fehlersuche

`~/.claude/claude-tracker/hook.log` zeigt jeden Aufruf bzw. den Fehler
(Login fehlgeschlagen, Tabelle fehlt, …).

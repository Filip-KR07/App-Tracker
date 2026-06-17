# Tracker Pro Template

Kopie des App-Tracker-Projekts als Startpunkt für eine neue App.

## Setup (5 Schritte)

1. **Supabase-Projekt** neu anlegen auf supabase.com
2. Im SQL-Editor des neuen Projekts dieselbe Tabelle + RLS erstellen (Schema aus dem Original-Repo)
3. In `index.html` den **CONFIG-Block** ganz oben im `<script>`-Tag anpassen:
   ```js
   const CONFIG = {
     appName:     'DeinAppName',
     appIcon:     '🚀',
     appSub:      'Dein Untertitel',
     supabaseUrl: 'https://DEIN-PROJEKT.supabase.co',
     supabaseKey: 'DEIN_ANON_KEY',
   };
   ```
4. `sw.js` aus dem Original-Repo kopieren
5. Auf GitHub Pages oder Netlify deployen

## Was du NICHT ändern musst
- Alle Module (Ziele, Sport, Arbeit, Finanzen, Markt)
- Onboarding-Flow
- Auth-System
- Cloud-Sync
- Service Worker

## Unterschiede zur privaten App
- Eigenes Supabase-Projekt = komplett getrennte Nutzerdaten
- Eigenes Branding via CONFIG
- Eigener App-Store-Eintrag (eigene Bundle-ID)

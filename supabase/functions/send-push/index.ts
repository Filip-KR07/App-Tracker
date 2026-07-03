// Supabase Edge Function: send-push
// Versendet eine Web-Push-Nachricht an alle Geräte eines Nutzers.
//
// Aufruf (server-to-server, z. B. aus einem Scheduler / pg_cron):
//   POST /functions/v1/send-push
//   Body: { "user_id": "<uuid>", "title": "...", "body": "..." }
//
// Deploy (ohne JWT-Prüfung, da server-intern aufgerufen):
//   supabase functions deploy send-push --no-verify-jwt
//
// Benötigte Secrets:
//   supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUBJECT=mailto:du@example.com
// (SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY stellt Supabase bereit.)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });

  try {
    const { user_id, title, body } = await req.json();
    if (!user_id) return new Response(JSON.stringify({ error: 'user_id required' }), { status: 400 });

    const url = Deno.env.get('SUPABASE_URL')!;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    webpush.setVapidDetails(
      Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@example.com',
      Deno.env.get('VAPID_PUBLIC_KEY')!,
      Deno.env.get('VAPID_PRIVATE_KEY')!,
    );

    const admin = createClient(url, service);
    const { data: subs, error } = await admin
      .from('push_subscriptions')
      .select('endpoint, subscription')
      .eq('user_id', user_id);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    const payload = JSON.stringify({ title: title || 'Tracker', body: body || '' });
    const results: Array<{ endpoint: string; ok: boolean }> = [];

    for (const row of subs ?? []) {
      try {
        await webpush.sendNotification(row.subscription, payload);
        results.push({ endpoint: row.endpoint, ok: true });
      } catch (e) {
        // 404/410 = Subscription abgelaufen → aufräumen
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) {
          await admin.from('push_subscriptions').delete().eq('endpoint', row.endpoint);
        }
        results.push({ endpoint: row.endpoint, ok: false });
      }
    }

    return new Response(JSON.stringify({ sent: results.filter(r => r.ok).length, results }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});

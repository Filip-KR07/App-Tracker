self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) if (c.url && 'focus' in c) return c.focus();
      return clients.openWindow(self.registration.scope);
    })
  );
});

self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : { title: 'Tracker', body: '' };
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body,
    icon: 'icon.png',
    badge: 'icon.png',
    vibrate: [100, 50, 100]
  }));
});

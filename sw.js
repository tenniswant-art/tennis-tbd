self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: '테니스병동', body: '새 알림' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://api.iconify.design/twemoji/tennis.svg',
      badge: 'https://api.iconify.design/twemoji/tennis.svg',
      vibrate: [200, 100, 200],
      data: { url: self.location.origin }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const client of list) {
        if (client.url === self.location.origin + '/' && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

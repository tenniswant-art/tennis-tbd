// fetch 핸들러 (안드로이드 Chrome PWA 설치 조건)
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  // 네트워크 우선, 실패 시 그냥 통과 (오프라인 캐시는 하지 않음 - 항상 최신)
  return;
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: '테니스병동', body: '새 알림' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
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

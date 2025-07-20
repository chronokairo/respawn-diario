// service-worker.js - Respawn Diário PWA
const CACHE_NAME = 'respawn-diario-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/base.css',
  '/assets/css/style.css',
  '/assets/css/components.css',
  '/assets/css/responsive.css',
  '/assets/js/main.js',
  '/assets/js/posts.js',
  '/assets/js/components.js',
  '/assets/js/config.js',
  '/assets/fonts/',
  '/assets/images/favicon-192.png',
  '/assets/images/favicon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});

self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  const title = data.title || 'Respawn Diário';
  const options = {
    body: data.body || 'Você tem uma nova notificação!',
    icon: '/assets/img/og-image.png',
    badge: '/assets/img/og-image.png',
    data: data.url || '/'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});

const CACHE_NAME = 'alarma-esp32-v2';
const ASSETS = [
  './index.html',
  './manifest.json'
];

// Instalar y cachear archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activar y limpiar caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Responder desde cache si no hay red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// ─── Recibir mensaje desde index.html y mostrar notificación ─────────
self.addEventListener('message', event => {
  const { titulo, cuerpo } = event.data;
  if (!titulo) return;

  self.registration.showNotification(titulo, {
    body: cuerpo,
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [200, 100, 200],
    requireInteraction: false
  });
});

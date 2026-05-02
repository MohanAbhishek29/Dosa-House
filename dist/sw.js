const CACHE_NAME = 'dosa-house-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/menu.html',
  '/booking.html',
  '/orders.html',
  '/about.html',
  '/styles/main.css',
  '/styles/ui.css',
  '/scripts/main.js',
  '/scripts/ui.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .catch(err => console.log('Cache install error', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

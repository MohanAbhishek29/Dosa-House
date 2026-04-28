const CACHE_NAME = 'dosa-house-v1';
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
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

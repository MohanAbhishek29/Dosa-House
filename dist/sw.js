const CACHE_NAME = 'dosa-house-v8';
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
  '/scripts/ui.js',
  '/scripts/auth.js',
  '/scripts/firebase-config.js'
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
    caches.match(event.request).then(cachedResponse => {
      // Only cache GET requests from our own origin (exclude Firebase APIs, etc)
      const url = new URL(event.request.url);
      const isSameOrigin = url.origin === location.origin;
      const isGET = event.request.method === 'GET';

      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Cache the new response for next time if it's a local static asset
        if (isGET && isSameOrigin && networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed, return cached response if available
      });
      
      // Return cached response immediately if there is one, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});

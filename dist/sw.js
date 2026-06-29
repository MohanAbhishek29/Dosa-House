const CACHE_NAME = 'dosa-house-v9';
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
  // Fix for Chrome DevTools bug
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === location.origin;
  const isGET = event.request.method === 'GET';

  // Bypass service worker for non-GET or cross-origin requests (e.g. Firebase)
  if (!isGET || !isSameOrigin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Update cache in the background (Stale-While-Revalidate)
        event.waitUntil(
          fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          }).catch(err => console.log('Background fetch failed:', err))
        );
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(err => {
        console.error('Network fetch failed:', err);
        throw err;
      });
    })
  );
});

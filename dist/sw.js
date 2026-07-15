const CACHE_VERSION = 'v-booking-style-b-1'; // Update this to force SW refresh

self.addEventListener('install', event => {
  // Force the new service worker to become active immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // Delete ALL caches to ensure fresh files
          return caches.delete(cache);
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  // Network first, bypass cache for now
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

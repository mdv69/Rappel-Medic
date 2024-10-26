const CACHE_NAME = 'rappel-medicaments-cache-v1';
const urlsToCache = [
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      console.log('Ouverture du cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activé');
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      // Ressource trouvée dans le cache
      if (response) {
        return response;
      }
      // Ressource non trouvée, la récupérer sur le réseau
      return fetch(event.request);
    })
  );
});

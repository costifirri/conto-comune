const CACHE_NAME = 'conto-comune-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './firebase-config.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// il messaggio arriva dal pulsante "Ripara" dell'app
self.addEventListener('message', (event) => {
  if (event.data === 'svuota-cache') {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))));
  }
});

// Rete prima, cache come riserva: gli aggiornamenti arrivano subito e l'app
// funziona offline. Vengono gestiti SOLO i file dell'app: il traffico verso
// Firebase e le altre origini passa intatto, altrimenti una risposta di riserva
// sbagliata (per esempio index.html al posto di uno script) blocca l'avvio.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return response;
      })
      .catch(async () => {
        const hit = await caches.match(req);
        if (hit) return hit;
        // solo l'apertura di una pagina può ripiegare sull'app in cache
        if (req.mode === 'navigate') {
          const home = await caches.match('./index.html');
          if (home) return home;
        }
        return Response.error();
      })
  );
});

const CACHE = 'shc-v9';
const ASSETS = ['/', '/index.html', '/crop_example.mp4'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for API calls, cache-first for assets
  if (e.request.url.includes('selfhaircut-backend') || e.request.url.includes('formspree') || e.request.url.includes('stripe')) {
    return; // let network handle these
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

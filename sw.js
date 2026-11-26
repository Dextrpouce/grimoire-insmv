// Service worker : l'appli fonctionne hors connexion.
const CACHE = 'insmv-v21';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/app.js', 'js/rules.js', 'js/store.js', 'js/table.js', 'js/scenario.js', 'js/cloud.js', 'js/config.js', 'js/mjlock.js', 'js/manuel.js', 'js/slot.js', 'js/data/superieurs.js', 'js/data/descriptions.js', 'js/data/pouvoirs.js', 'js/data/bestiaire.js', 'js/data/pnjrapides.js', 'js/data/scenarios-livres.js', 'js/data/hierarchie.js', 'js/data/tables-mj.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/favicon-64.png',
  'img/cover.webp', 'img/mv.webp', 'img/ins.webp', 'img/deepee.webp', 'img/serpent.webp',
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const cacheable = url.origin === location.origin || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'
    || (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/'));
  if (!cacheable) return;
  e.respondWith(caches.open(CACHE).then(async (cache) => {
    const same = url.origin === location.origin;
    const cached = await cache.match(e.request, { ignoreSearch: same });
    const fallback = cached || (e.request.mode === 'navigate' ? await cache.match('index.html') : undefined);
    const req = same && e.request.mode !== 'navigate' ? new Request(e.request, { cache: 'no-cache' }) : e.request;
    const network = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') cache.put(e.request, res.clone()); return res; });
    if (!same && cached) return cached;
    if (!fallback) return network;
    const timeout = new Promise((resolve) => setTimeout(() => resolve(fallback), 3000));
    return Promise.race([network.catch(() => fallback), timeout]);
  }));
});

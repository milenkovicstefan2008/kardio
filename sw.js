/* Offline rad: prvo mreža (da stignu nove verzije), a bez mreže iz keša. */
const KES = 'kardio-a59f23925b';
const FAJLOVI = ['./', './index.html', './data.js', './app.js', './manifest.json', './ikona.png', './ikona-192.png', './ikona-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(KES).then(c => c.addAll(FAJLOVI)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== KES).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && new URL(e.request.url).origin === location.origin) { const k = r.clone(); caches.open(KES).then(c => c.put(e.request, k)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});

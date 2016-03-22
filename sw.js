var VERSION = '0.0.1';

this.addEventListener('install', function(e) {
  e.waitUntil(caches.open(VERSION).then(cache => {
    return cache.addAll([
      '/',
      '/index.html',
      '/app.css',
      '/app.js',
      '/emoji-print.js',
      '/manifest.json',
    ]);
}))});

this.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).catch(_ => {
    return handleNoCacheMatch();
  }))
});

this.addEventListener('active', function(e) {
  e.waitUntil(caches.key().then((keys) => {
    return Promise.all(keys.map(k => {
      if (k !== VERSION) {
        return caches.delete(k);
      }
    }));
}))});

// fetch from network
// and put into our cache
function handleNoCacheMatch(e) {
  return fetch(e.request).then(res => {
    caches.open(VERSION).then(cache => {
      cache.put(e.request, res.clone());

      return res;
    });
  });
}

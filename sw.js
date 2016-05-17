var VERSION = '0.0.8';

this.addEventListener('install', function(e) {
  e.waitUntil(caches.open(VERSION).then(cache => {
    return cache.addAll([
      '/',
      '/index.html',
      '/app.css',
      '/app.js',
      '/footer-menu.js',
      '/page-menu.js',
      '/draw-canvas.js',
      '/brush-picker.js',
      '/brush-picker-pane.js',
      '/emoji-map.js',
      '/size-picker.js',
      '/background-overlay.js',
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

var VERSION = '0.0.8';

this.addEventListener('install', function(e) {
  e.waitUntil(caches.open(VERSION).then(cache => {
    return cache.addAll([
      '/',
      '/index.html',
      '/src/app.css',
      '/src/app.js',
      '/src/footer-menu.js',
      '/src/page-menu.js',
      '/src/draw-canvas.js',
      '/src/brush-picker-pane.js',
      '/src/emoji-map.js',
      '/src/size-picker.js',
      '/src/background-overlay.js',
      '/manifest.json',
    ]);
}))});

this.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).catch(_ => {
    return handleNoCacheMatch();
  }))
});

this.addEventListener('activate', function(e) {
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
    return caches.open(VERSION).then(cache => {
      cache.put(e.request, res.clone());

      return res;
    });
  });
}

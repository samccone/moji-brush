var VERSION = '0.0.11';

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
      '/brush-picker-pane.js',
      '/emoji-map.js',
      '/size-picker.js',
      '/background-overlay.js',
      '/welcome.json',
      '/manifest.json',
      '/vendor/fetch.js',
      '/vendor/webcomponents-lite.min.js',
    ]);
}))});

this.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).catch(_ => {
    return handleNoCacheMatch();
  }))
});

this.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then((keys) => {
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

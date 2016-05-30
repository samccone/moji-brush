'use strict';

var VERSION = '0.0.9';

undefined.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (cache) {
    return cache.addAll(['/', '/index.html', '/app.css', '/app.js', '/footer-menu.js', '/page-menu.js', '/draw-canvas.js', '/brush-picker-pane.js', '/emoji-map.js', '/size-picker.js', '/background-overlay.js', '/welcome.json', '/manifest.json']);
  }));
});

undefined.addEventListener('fetch', function (e) {
  e.respondWith(caches.match(e.request).catch(function (_) {
    return handleNoCacheMatch();
  }));
});

undefined.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) {
      if (k !== VERSION) {
        return caches.delete(k);
      }
    }));
  }));
});

// fetch from network
// and put into our cache
function handleNoCacheMatch(e) {
  return fetch(e.request).then(function (res) {
    return caches.open(VERSION).then(function (cache) {
      cache.put(e.request, res.clone());

      return res;
    });
  });
}

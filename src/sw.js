var VERSION = '0.0.17';

// generated via https://gist.github.com/samccone/f9ab817944a7b69d2b8716e37d887ce9
var emojiList = [
  "/images/emoji/google/black/1f3a5.png",
  "/images/emoji/google/black/1f3a9.png",
  "/images/emoji/google/black/1f3b1.png",
  "/images/emoji/google/black/1f4a3.png",
  "/images/emoji/google/black/1f576.png",
  "/images/emoji/google/black/1f5dd.png",
  "/images/emoji/google/blue/1f41f.png",
  "/images/emoji/google/blue/1f5f3.png",
  "/images/emoji/google/blue/1f68e.png",
  "/images/emoji/google/blue/1f6e1.png",
  "/images/emoji/google/blue/2708.png",
  "/images/emoji/google/blue-light/1f4a7.png",
  "/images/emoji/google/blue-light/1f516.png",
  "/images/emoji/google/blue-light/2668.png",
  "/images/emoji/google/blue-light/2693.png",
  "/images/emoji/google/blue-light/2744.png",
  "/images/emoji/google/brown-dark/1f3c8.png",
  "/images/emoji/google/brown-dark/1f40e.png",
  "/images/emoji/google/brown-dark/1f43b.png",
  "/images/emoji/google/brown-dark/1f45e.png",
  "/images/emoji/google/brown-dark/1f4a9.png",
  "/images/emoji/google/brown-dark/1f4ff.png",
  "/images/emoji/google/brown-light/1f36a.png",
  "/images/emoji/google/brown-light/1f375.png",
  "/images/emoji/google/brown-light/1f3da.png",
  "/images/emoji/google/brown-light/1f43f.png",
  "/images/emoji/google/brown-light/1f58a.png",
  "/images/emoji/google/brown-light/26b0.png",
  "/images/emoji/google/green-dark/1f33f.png",
  "/images/emoji/google/green-dark/1f40a.png",
  "/images/emoji/google/green-dark/1f432.png",
  "/images/emoji/google/green-dark/1f458.png",
  "/images/emoji/google/green-dark/2618.png",
  "/images/emoji/google/green-light/1f348.png",
  "/images/emoji/google/green-light/1f350.png",
  "/images/emoji/google/green-light/1f40d.png",
  "/images/emoji/google/green-light/1f438.png",
  "/images/emoji/google/green-light/1f4b8.png",
  "/images/emoji/google/grey-dark/1f39e.png",
  "/images/emoji/google/grey-dark/1f4f0.png",
  "/images/emoji/google/grey-dark/1f577.png",
  "/images/emoji/google/grey-dark/1f578.png",
  "/images/emoji/google/grey-light/1f3d0.png",
  "/images/emoji/google/grey-light/1f3db.png",
  "/images/emoji/google/grey-light/1f54a.png",
  "/images/emoji/google/grey-light/1f56f.png",
  "/images/emoji/google/grey-light/1f5d2.png",
  "/images/emoji/google/grey-medium/1f399.png",
  "/images/emoji/google/grey-medium/1f400.png",
  "/images/emoji/google/grey-medium/1f403.png",
  "/images/emoji/google/grey-medium/1f480.png",
  "/images/emoji/google/grey-medium/1f6e2.png",
  "/images/emoji/google/indigo/1f302.png",
  "/images/emoji/google/indigo/1f40b.png",
  "/images/emoji/google/indigo/1f418.png",
  "/images/emoji/google/indigo/1f42c.png",
  "/images/emoji/google/indigo/1f456.png",
  "/images/emoji/google/indigo/1f6b0.png",
  "/images/emoji/google/indigo/260e.png",
  "/images/emoji/google/orange/1f342.png",
  "/images/emoji/google/orange/1f3c9.png",
  "/images/emoji/google/orange/1f420.png",
  "/images/emoji/google/orange/1f431.png",
  "/images/emoji/google/orange/1f434.png",
  "/images/emoji/google/orange/2638.png",
  "/images/emoji/google/red/1f336.png",
  "/images/emoji/google/red/1f337.png",
  "/images/emoji/google/red/1f339.png",
  "/images/emoji/google/red/1f39f.png",
  "/images/emoji/google/red/1f58d.png",
  "/images/emoji/google/red/1f608.png",
  "/images/emoji/google/red/1f980.png",
  "/images/emoji/google/pink/1f338.png",
  "/images/emoji/google/pink/1f33c.png",
  "/images/emoji/google/pink/1f346.png",
  "/images/emoji/google/pink/1f347.png",
  "/images/emoji/google/pink/1f351.png",
  "/images/emoji/google/pink/1f429.png",
  "/images/emoji/google/pink/1f457.png",
  "/images/emoji/google/pink/1f460.png",
  "/images/emoji/google/pink/1f47e.png",
  "/images/emoji/google/white/1f401.png",
  "/images/emoji/google/white/1f407.png",
  "/images/emoji/google/white/1f410.png",
  "/images/emoji/google/white/1f6c1.png",
  "/images/emoji/google/white/1f984.png",
  "/images/emoji/google/yellow/1f34b.png",
  "/images/emoji/google/yellow/1f397.png",
  "/images/emoji/google/yellow/1f3f7.png",
  "/images/emoji/google/yellow/1f41d.png",
  "/images/emoji/google/yellow/1f424.png",
  "/images/emoji/google/yellow/1f425.png",
  "/images/emoji/google/yellow/1f4a1.png"
]


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
      '/brush-preview.js',
      '/brush-picker-pane.js',
      '/emoji-map.js',
      '/size-picker.js',
      '/background-overlay.js',
      '/welcome.json',
      '/manifest.json',
      '/vendor/fetch.js',
      '/vendor/webcomponents-lite.min.js',
    ].concat(...emojiList)).then(_ => this.skipWaiting());
}))});

this.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).then((res) => {
    // If there is no match in the cache, we get undefined back,
    // in that case go to the network!
    return res ? res : handleNoCacheMatch(e);
  }));
});

this.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then((keys) => {
    return Promise.all(keys.map(k => {
      if (k !== VERSION) {
        return caches.delete(k);
      }
    })).then(_ => {
      return this.clients.claim()
    });
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

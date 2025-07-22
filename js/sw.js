self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './css/estilo.css',
                './css/flappy.css',
                './js/flappy.js',
                './imgs/passaro.png'
            ]);
        })
    );
});
self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// Nome do cache utilizado para armazenar os arquivos
const CACHE_NAME = 'teste-v3';
// Página que será exibida quando o usuário estiver offline
const OFFLINE_URL = './offline.html';

// Lista de arquivos que devem ser armazenados no cache
const ASSETS = [
    './',
    './imgs/passaro.png',
    './fonts/Oswald-Regular.ttf',
    './fonts/Pixel.ttf',
    './js/flappy.js',
    './css/estilo.css',
    './css/flappy.css',
    // './index.html',
    // './offline.html',
    // './styles.css',
    // './verificarconexao.js',
    './icons/192.png',
    './icons/512.png',
    './icons/apple-icon-180.png'
];

// Evento disparado quando o service worker é instalado
self.addEventListener('install', event => {
    event.waitUntil(
        // Abre o cache com o nome definido e adiciona todos os arquivos da lista ASSETS
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            // Força a ativação imediata do novo service worker
            .then(() => self.skipWaiting())
    );
});

// Evento disparado quando o service worker é ativado
self.addEventListener('activate', event => {
    event.waitUntil(
        // Remove caches antigos que não correspondem ao CACHE_NAME atual
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
        // Faz com que o service worker controle imediatamente todas as páginas abertas
        .then(() => self.clients.claim())
    );
});

// Evento que intercepta todas as requisições da página
self.addEventListener('fetch', event => {
    event.respondWith(
        // Tenta fazer a requisição normalmente
        fetch(event.request).catch(() => {
            // Se falhar (por exemplo, sem conexão), tenta buscar no cache
            return caches.match(event.request)
                // Se não estiver no cache, mostra a página OFFLINE
                .then(resp => resp || caches.match(OFFLINE_URL));
        })
    );
});
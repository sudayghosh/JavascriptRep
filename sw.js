const cacheName = "sw-demo-cache";
const urlToCache  = [
    '/',
    'css/style.css',
    'js/main.js'
];

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(cacheName)
        .then(cache=> cache.addAll(urlToCache))
        .then(self.skipWaiting())
    );    
});

self.addEventListener('fetch', function(event){
    console.log(self.location.origin);
    event.respondWith(
        caches.match(event.request)
        .then(function(response){
            if(response){
                return response;
            }
            return fetch(event.request)
            .then(function(response){
                if(!response || response.status!== 200 || response.type !== 'basic') {
                    return response;
                }
                var responseToCache = response.clone();
                caches.open(cacheName)
                .then(function(cache){
                    cache.put(event.request, responseToCache);
                });
            });
        })
    );
});
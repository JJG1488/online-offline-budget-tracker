

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    '/',
    './db.js',
    './service-worker.js',
    './index.html',
    './manifest.webmanifest',
    './styles.css',
    './index.js'

];


// install
self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE).catch(err => {
                console.log(err);
                console.log(FILES_TO_CACHE);
                console.log(cache);
            })
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

// fetch
self.addEventListener("fetch", function (evt) {
    // cache successful requests to the API
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch(err => {
                        // Network request failed, try to get it from the cache.
                        return cache.match(evt.request);
                    });
            }).catch(err => console.log(err))
        );

        return; 
    }

    evt.respondWith(
        caches.match(evt.request).then(function (response) {
            return response || fetch(evt.request);
        })
    );
});



// // install
// self.addEventListener("install", function (evt) {
//     // pre cache image data
//     // evt.waitUntil(
//     //     caches.open(DATA_CACHE_NAME).then((cache) => cache.add("/api/"))
//     // );

//     // pre cache all static assets
//     evt.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)).catch(err => {
//             console.log(err);
//         })
//     );

//     // tell the browser to activate this service worker immediately once it
//     // has finished installing
//     self.skipWaiting();
// });


// self.addEventListener("activate", function (evt) {
//     evt.waitUntil(
//         caches.keys().then(keyList => {
//             return Promise.all(
//                 keyList.map(key => {
//                     if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
//                         console.log("Removing old cache data", key);
//                         return caches.delete(key);
//                     }
//                 })
//             );
//         })
//     );

//     self.clients.claim();
// });

// self.addEventListener('fetch', function (evt) {
//     // code to handle requests goes here

//     if (evt.request.url.includes('/api/')) {
//         console.log('[Service Worker] Fetch (data)', evt.request.url);

//         evt.respondWith(
//             caches.open(DATA_CACHE_NAME).then(cache =>{
//                 return fetch(evt.request)
//                 .then(response => {
//                     if (response.status === 200) {
//                         cache.post(evt.request.url, response.clone());
//                     }

//                     return response;
//                 })
//                 .catch(err => {
//                     return cache.match(evt.request);
//                 });
//             })
//         );

//         return;
//     }

//     // ======

//     // evt.respondWith(
//     //     fetch(evt.request).catch(() => {
//     //         return caches.match(evt.request).then((response) => {
//     //             if (response) {
//     //                 return response;
//     //             } else if (evt.request.headers.get("accept").includes("text/plain")) {
//     //                 return caches.match("/");
//     //             }
//     //         });
//     //     })
//     // );

//     // ==== original
//     evt.respondWith(
//         caches.open(CACHE_NAME).then(cache => {
//             return cache.match(evt.request).then(response => {
//                 return response || fetch(evt.request);
//             });
//         })
//     );
// });


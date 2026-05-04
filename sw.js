const CACHE_NAME = "leonard-lee-static-v1";
const ASSETS = [
  "./",
  "./gwglulpjnx.html",
  "./manifest.json",
  "./agentlee_avatar.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

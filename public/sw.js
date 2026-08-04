self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Sin caché de datos dinámicos: la app necesita conexión al servidor.
  // Este listener existe para cumplir el criterio de instalación como PWA.
});

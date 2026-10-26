// Kill switch for service workers left behind by the previous version of this site.
// Browsers re-fetch this script on navigation; it clears old caches, unregisters itself
// and reloads open tabs so they show the current site.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) await caches.delete(key);
      await self.registration.unregister();
      for (const client of await self.clients.matchAll({ type: "window" })) client.navigate(client.url);
    })(),
  );
});

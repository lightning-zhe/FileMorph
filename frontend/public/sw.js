// FileMorph SW v2
const SHARE_KEY = '/pending-share';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  if (e.request.method === 'POST' && url.pathname === '/share') {
    e.respondWith(
      (async () => {
        const fd = await e.request.formData();
        const file = fd.get('file');
        if (file) {
          const cache = await caches.open('shared-files');
          await cache.put(SHARE_KEY, new Response(file));
        }
        return Response.redirect('/?shared=1', 303);
      })()
    );
    return;
  }

  if (url.pathname === SHARE_KEY) {
    e.respondWith(
      (async () => {
        const cache = await caches.open('shared-files');
        const cached = await cache.match(SHARE_KEY);
        return cached || new Response(null, { status: 404 });
      })()
    );
  }
});

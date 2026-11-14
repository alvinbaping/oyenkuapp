const CACHE = 'oyenku-site-v6:' + self.registration.scope;
const root = self.registration.scope;
const site = ['./','index.html','privacy.html','terms.html','style.css','site.js','offline.js','mobile-demo.js','mobile-demo.css','assets/oyen.png','assets/demo/bank.webp','assets/demo/business.webp','assets/demo/cash.webp','assets/demo/education.webp','assets/demo/entertainment.webp','assets/demo/food.webp','assets/demo/gift.webp','assets/demo/health.webp','assets/demo/other.webp','assets/demo/salary.webp','assets/demo/shopping.webp','assets/demo/transport.webp'];
const url = path => new URL(path, root).href;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(site.map(url))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    if (await caches.has('oyenku-site-v1')) {
      const legacy = await caches.open('oyenku-site-v1');
      for (const request of await legacy.keys()) {
        if (request.url.startsWith(root)) await legacy.delete(request);
      }
    }
    await caches.delete('oyenku-site-v2:' + root);
    await caches.delete('oyenku-site-v3:' + root);
    await caches.delete('oyenku-site-v4:' + root);
    await caches.delete('oyenku-site-v5:' + root);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request=event.request;
  if (request.method!=='GET' || !request.url.startsWith(root)) return;
  const path=request.url.slice(root.length).split('?')[0];
  if (![...site,''].includes(path)) return;
  event.respondWith((async () => {
    const cache=await caches.open(CACHE);
    const key=url(path || './');
    try {
      const response=await fetch(request);
      if(response.ok) await cache.put(key,response.clone());
      return response;
    } catch {
      return await cache.match(key) || Response.error();
    }
  })());
});

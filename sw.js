var V="treino-v3";
var FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png"];
self.addEventListener("install",function(e){
 e.waitUntil(caches.open(V).then(function(c){
  return Promise.all(FILES.map(function(f){return fetch(f,{cache:"reload"}).then(function(r){if(r&&r.ok)return c.put(f,r)}).catch(function(){})}));
 }).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
 e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
 var r=e.request;
 if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
 e.respondWith(
  fetch(r.url,{cache:"no-cache"}).then(function(res){
   if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}
   return res;
  }).catch(function(){return caches.match(r).then(function(hit){return hit||caches.match("./index.html")})})
 );
});

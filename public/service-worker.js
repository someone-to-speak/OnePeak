const CACHE_NAME = "pwa-cache-v1";

// 설치 단계
self.addEventListener("install", () => {
  console.log("Service Worker installing.");
});

// 네트워크 요청 처리
self.addEventListener("fetch", (event) => {
  console.log("Fetch event for ", event.request.url);
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response("", {
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "text/html" }
      });
    })
  );
});

// 이전 캐시 제거
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 푸시 알림 수신
self.addEventListener("push", (event) => {
  let title = "푸시 알림";
  let body = "새로운 알림이 도착했습니다.";
  let options = {
    body: body,
    icon: "/app-icon.svg"
  };

  // 권한 상태 확인
  event.waitUntil(
    self.registration.showNotification(title, options).catch((error) => {
      console.error("Failed to show notification:", error);
    })
  );
});

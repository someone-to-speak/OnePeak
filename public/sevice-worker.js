self.addEventListener("push", (event) => {
  const data = event.data ? JSON.parse(event.data.text()) : {};
  const options = {
    body: data.message,
    icon: "/icons/icon-192x192.png", // 아이콘 경로 수정
    badge: "/icons/badge-72x72.png" // 배지 아이콘 경로 수정
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

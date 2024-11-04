"use client";

import { requestNotificationPermission } from "@/utils/notifications/pushSubscription";

const NotificationSetupButton = ({ userId }: { userId: string }) => {
  const handleNotificationSetup = async () => {
    if (!userId) return;

    // 알림 권한 요청
    const permissionResult = await Notification.requestPermission();
    if (permissionResult === "granted") {
      // 권한이 허용된 경우
      await requestNotificationPermission(userId);
    } else {
      console.warn("Notification permission denied.");
    }
  };

  return (
    <button onClick={handleNotificationSetup} className="bg-blue-500 text-white px-4 py-2 rounded">
      알림 설정
    </button>
  );
};

export default NotificationSetupButton;

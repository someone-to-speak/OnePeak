"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Tables } from "../../../../database.types";
import NotificationButton from "@/components/notification/NotificationButton";
import { requestNotificationPermission } from "@/utils/notifications/pushSubscription";

type NotificationType = Tables<"notifications">;

const NotificationPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [notifi, setNotifi] = useState<NotificationType[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // 푸시 알림 권한 요청
    if (userId) requestNotificationPermission(userId);
  }, [userId, requestNotificationPermission]);

  useEffect(() => {
    const fetchUserNoti = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id);
        const { data: noti } = await supabase.from("notifications").select("*").eq("user_id", data.session.user.id);
        setNotifi(noti);
      }
    };
    fetchUserNoti();
  }, [supabase]);

  const markAsRead = async (notificationId: number) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId);

    setNotifi(
      (prevNotis) => prevNotis?.map((noti) => (noti.id === notificationId ? { ...noti, is_read: true } : noti)) || null
    );
  };

  if (!userId) return null;

  const Notifications = notifi?.filter((noti) => !noti.is_read);

  return (
    <>
      <NotificationButton userId={userId} />
      <div className="mt-4 space-y-4">
        {Notifications && Notifications.length > 0 ? (
          Notifications.slice()
            .reverse()
            .map((noti) => (
              <div
                key={noti.id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer"
                onClick={() => {
                  if (!noti.is_read) {
                    markAsRead(noti.id);
                  }
                }}
              >
                <h3 className="text-lg font-semibold">{noti.title}</h3>
                <p className="text-gray-700">{noti.message}</p>
                <p className="text-sm text-gray-500">{noti.created_at}</p>
                {!noti.is_read && (
                  <span className="inline-block bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1 mt-2">
                    확인
                  </span>
                )}
              </div>
            ))
        ) : (
          <div className="text-gray-500">알림없음</div>
        )}
      </div>
    </>
  );
};

export default NotificationPage;

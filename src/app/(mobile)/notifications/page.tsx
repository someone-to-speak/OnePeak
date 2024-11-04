"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Tables } from "../../../../database.types";

type NotificationType = Tables<"notifications">;

const NotificationPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [notifi, setNotifi] = useState<NotificationType[] | null>(null);
  const supabase = createClient();

  // 사용자 ID 가져오기
  useEffect(() => {
    const initialize = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id);
      }
    };

    initialize();
  }, [supabase]);

  // 알림 가져오기
  useEffect(() => {
    const fetchUserNoti = async () => {
      const { data: noti } = await supabase.from("notifications").select("*");
      setNotifi(noti);
      console.log("Fetched notifications for user:", noti);
    };

    fetchUserNoti();
  }, [supabase]);

  // 오래된 알림 정리
  useEffect(() => {
    const cleanupOldNotifications = async () => {
      if (!userId) {
        console.warn("User ID is null, cannot clean up old notifications.");
        return;
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      console.log("Cleaning up notifications older than:", thirtyDaysAgo.toISOString());

      await supabase.from("notifications").delete().lt("created_at", thirtyDaysAgo.toISOString());

      // 마케팅 동의 여부 불러오기
      const { data: marketed } = await supabase.from("user_info").select("is_marketing").eq("id", userId).single();
      console.log("Marketing:", marketed);

      if (marketed && marketed.is_marketing) {
        const { data: updatedNoti } = await supabase
          .from("notifications")
          .select("*")
          .in("type", ["marketingMsg", "noticeMsg"])
          .eq("user_id", userId);

        setNotifi(updatedNoti);
        console.log("Updated marketing noti:", updatedNoti);
      }
    };

    if (userId) {
      cleanupOldNotifications();
    }
  }, [userId, supabase]);

  // 푸시 알림 구독 설정
  const subscribeToNotifications = useCallback(() => {
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        async (payload: { new: { title: string; message: string } }) => {
          console.log("New notification received:", payload);

          // 수신한 payload의 내용을 상세히 로그 출력
          console.log("Received notification data:", JSON.stringify(payload.new, null, 2));

          const { title, message } = payload.new;
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification(title, {
            body: message,
            icon: "/icon-192x192.png",
            badge: "/icon-192x192.png"
          });
        }
      )
      .subscribe();

    console.log("Subscribed to notifications channel.");
    return subscription;
  }, [supabase]);

  useEffect(() => {
    if (userId) {
      const subscription = subscribeToNotifications();
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId, subscribeToNotifications]);

  if (!userId) return null;

  return (
    <div className="mt-4 space-y-4">
      {notifi && notifi.length > 0 ? (
        notifi
          .slice()
          .reverse()
          .map((noti) => (
            <div key={noti.id} className="bg-white shadow-md rounded-sm p-4">
              <h3 className="text-lg font-semibold">{noti.title}</h3>
              <p className="text-gray-700">{noti.message}</p>
              <p className="text-sm text-gray-500">{noti.created_at}</p>
            </div>
          ))
      ) : (
        <div className="text-gray-500">알림없음</div>
      )}
    </div>
  );
};

export default NotificationPage;

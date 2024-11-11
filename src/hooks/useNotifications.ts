import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { Tables } from "../../database.types";

type NotificationType = Tables<"notifications">;

const useNotifications = () => {
  const [notifi, setNotifi] = useState<NotificationType[] | null>(null);
  const supabase = createClient();
  const { userInfo } = useUser();

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
      if (!userInfo) return;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      await supabase.from("notifications").delete().lt("created_at", thirtyDaysAgo.toISOString());

      if (userInfo.is_marketing) {
        const { data: updatedNoti } = await supabase
          .from("notifications")
          .select("*")
          .in("type", ["marketingMsg", "noticeMsg"])
          .eq("user_id", userInfo.id);

        setNotifi(updatedNoti);
        console.log("Updated marketing noti:", updatedNoti);
      }
    };

    if (userInfo?.id) {
      cleanupOldNotifications();
    }
  }, [userInfo, supabase]);

  // 푸시 알림 구독 설정
  const subscribeToNotifications = useCallback(() => {
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        async (payload: { new: { title: string; message: string } }) => {
          const { title, message } = payload.new;
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification(title, {
            body: message,
            icon: "/app-icon.png",
            badge: "/app-icon.png"
          });
        }
      )
      .subscribe();

    console.log("Subscribed to notifications channel.");
    return subscription;
  }, [supabase]);

  useEffect(() => {
    if (userInfo) {
      const subscription = subscribeToNotifications();
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userInfo, subscribeToNotifications]);

  return { notifi, setNotifi };
};

export default useNotifications;

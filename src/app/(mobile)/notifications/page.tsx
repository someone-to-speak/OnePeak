"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Tables } from "../../../../database.types";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import Image from "next/image";
import stamp from "@/../public/images/Stamp.svg";
import WithIconHeader from "@/components/ui/WithIconHeader";

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
    <div className="bg-white">
      <WithIconHeader title="알림" />
      <div className="flex flex-col px-[16px]">
        {notifi && notifi.length > 0 ? (
          <Accordion isCompact>
            {notifi
              .slice()
              .reverse()
              .map((noti) => (
                <AccordionItem
                  key={noti.id}
                  title={
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row gap-[8px]">
                        <Image src={stamp} alt={"Stamp"} width={18} height={18} />
                        <p className="text-[#0c0c0c] text-base font-bold font-['SUIT'] leading-[27px]">{noti.title}</p>
                      </div>
                      <p className="text-right text-[#a5a5a5] text-sm font-medium font-['Pretendard'] leading-[21px]">
                        {new Date(noti.created_at).toLocaleString()}
                      </p>
                    </div>
                  }
                  className="flex flex-col border-b border-b-[#f3f3f3] py-[20px]"
                >
                  <p className="text-[#3f3f3f] text-sm font-medium font-['Pretendard'] leading-[21px] text-left">
                    {noti.message}
                  </p>
                </AccordionItem>
              ))}
          </Accordion>
        ) : (
          <div className="text-gray-500">알림없음</div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

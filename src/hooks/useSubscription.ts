import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { requestNotificationPermission } from "@/utils/notifications/pushSubscription";

export const useSubscription = (userId: string) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState<boolean>(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchSubscription = async () => {
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("subscription")
        .eq("user_id", userId)
        .single();
      setIsNotificationEnabled(!!existingSubscription);
    };

    fetchSubscription();
  }, [userId, supabase]);

  const enableNotifications = async () => {
    const permissionResult = await requestNotificationPermission(userId);
    if (permissionResult) {
      setIsNotificationEnabled(true);
    }
  };

  const disableNotifications = async () => {
    try {
      await supabase.from("subscriptions").delete().eq("user_id", userId);
      setIsNotificationEnabled(false);
    } catch (err) {
      alert("알림 비활성화 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleNotificationToggle = async () => {
    if (isNotificationEnabled) {
      await disableNotifications();
    } else {
      await enableNotifications();
    }
  };

  return { isNotificationEnabled, handleNotificationToggle };
};

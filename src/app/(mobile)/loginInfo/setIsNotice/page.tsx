"use client";
import { requestNotificationPermission } from "@/utils/notifications/pushSubscription";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const NoticePage = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isNotice, setIsNotice] = useState<boolean | null>(null);

  useEffect(() => {
    const handleNoticePermission = async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data?.session?.user?.id;

      if (!userId) {
        console.warn("사용자 ID가 없습니다.");
        return;
      }

      if (isNotice) {
        const permissionResult = await requestNotificationPermission(userId);
        if (permissionResult) {
          alert("알림이 허용되었습니다.");
        } else {
          alert("알림을 받을 수 없습니다.");
        }
      } else if (isNotice === false) {
        alert("알림을 허용하지 않습니다.");
      }

      router.push("/");
    };

    if (isNotice !== null) {
      handleNoticePermission();
    }
  }, [isNotice, supabase, router]);

  return (
    <div className="p-6 bg-white rounded-sm shadow-md max-w-md mx-auto text-center">
      <p className="text-lg font-semibold mb-4">팝업을 허용하시겠습니까?</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setIsNotice(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-400 transition"
        >
          동의
        </button>
        <button
          onClick={() => setIsNotice(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          비동의
        </button>
      </div>
      <div className="mt-4"></div>
    </div>
  );
};

export default NoticePage;

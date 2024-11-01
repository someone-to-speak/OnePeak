// /hooks/useMatching.ts
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { initiateMatching } from "@/services/matchingService";
import { removeUserFromQueue } from "@/repositories/matchingRepository";
import { useUserInfoForMatching } from "@/hooks/getUserInfo";
import { createClient } from "@/utils/supabase/client";

export const useMatching = () => {
  const [isMatching, setIsMatching] = useState(false); // 로딩 상태 추가
  const router = useRouter();
  const { data: userInfo, isLoading, isError } = useUserInfoForMatching();
  const matchingChannelRef = useRef<RealtimeChannel | null>(null);

  const setupMatchingChannel = async () => {
    if (!userInfo) return;

    setIsMatching(true);

    const supabase = createClient();
    const roomId = await initiateMatching(userInfo.id, userInfo.my_language, userInfo.learn_language);

    if (roomId) {
      router.replace(`/chat?room=${roomId}`);
      setIsMatching(false);
    } else {
      const matchingChannel = supabase.channel("matches");
      matchingChannelRef.current = matchingChannel;

      matchingChannel
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "matches" }, (payload) => {
          console.log("UPDATE");
          const { new: updatedMatchQueue } = payload;
          if (updatedMatchQueue.user_id === userInfo.id) {
            router.replace(`/chat?room=${updatedMatchQueue.room_id}`);
            setIsMatching(false);
          }
        })
        .subscribe();
    }
  };

  useEffect(() => {
    if (!userInfo) return;
    // setupMatchingChannel();

    const cleanUp = async () => {
      await matchingChannelRef.current?.unsubscribe();
      await removeUserFromQueue(userInfo.id);
    };

    return () => {
      cleanUp();
    };
  }, [userInfo]);

  return { setupMatchingChannel, userInfo, isLoading, isError, isMatching };
};

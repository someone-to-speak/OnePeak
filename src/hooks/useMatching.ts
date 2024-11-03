// /hooks/useMatching.ts
import { useEffect, useRef, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { initiateMatching } from "@/services/matchingService";
import { removeUserFromQueue } from "@/repositories/matchingRepository";
import { useUserInfoForMatching } from "@/hooks/getUserInfo";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export const useMatching = () => {
  const [isMatching, setIsMatching] = useState(false); // 로딩 상태 추가
  const router = useRouter();
  const { data: userInfo, isLoading, isError } = useUserInfoForMatching();
  const matchingChannelRef = useRef<RealtimeChannel | null>(null);

  const setupMatchingChannel = async () => {
    if (!userInfo) return;

    setIsMatching(true);

    const supabase = createClient();
    const roomId = await initiateMatching(
      userInfo.id,
      userInfo.my_language as string,
      userInfo.learn_language as string
    );

    if (roomId) {
      setIsMatching(false);
      router.push(`/lesson/room?id=${roomId}`);
    } else {
      const matchingChannel = supabase.channel("matches");
      // matchingChannelRef.current = matchingChannel;

      matchingChannel.on("postgres_changes", { event: "UPDATE", schema: "public", table: "matches" }, (payload) => {
        console.log("UPDATE");
        const { new: updatedMatchQueue } = payload;
        if (updatedMatchQueue.user_id === userInfo.id) {
          setIsMatching(false);
          matchingChannel.unsubscribe();
          router.push(`/lesson/room?id=${updatedMatchQueue.room_id}`);
        }
      });
      matchingChannel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("SUBSCRIBED");
        }
      });
    }
  };

  useEffect(() => {
    if (!userInfo) return;
    // setupMatchingChannel();

    const cleanUp = async () => {
      // await matchingChannelRef.current?.unsubscribe();
      await removeUserFromQueue(userInfo.id);
    };

    return () => {
      cleanUp();
    };
  }, [userInfo]);

  return { setupMatchingChannel, userInfo, isLoading, isError, isMatching };
};

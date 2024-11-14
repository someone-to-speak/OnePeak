import { useCallback, useEffect, useRef, useState } from "react";
import { RealtimeChannel, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { initiateMatching } from "@/services/matchingService";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "./useUser";
import { matche } from "@/types/chatType/chatType";
import { removeUserFromQueue } from "@/api/supabase/match";

export const useMatching = () => {
  const supabase = createClient();
  const [isMatching, setIsMatching] = useState(false); // 로딩 상태 추가
  const router = useRouter();
  const { userInfo, isLoading } = useUser();
  const matchingChannelRef = useRef<RealtimeChannel | null>(null);

  const cleanUp = useCallback(async () => {
    await matchingChannelRef.current?.unsubscribe();
    await removeUserFromQueue(userInfo?.id as string);
  }, [userInfo?.id]);

  const handleUpdateSignal = useCallback(
    async (payload: RealtimePostgresUpdatePayload<matche>) => {
      const updatedMatchQueue = payload;
      if (updatedMatchQueue.new.user_id === userInfo?.id) {
        await cleanUp();
        router.push(`/lesson/room?id=${updatedMatchQueue.new.room_id}`);
      }
    },
    [cleanUp, router, userInfo?.id]
  );

  const setupMatchingChannel = useCallback(async () => {
    if (!userInfo || isLoading || matchingChannelRef.current) return;

    setIsMatching(true);

    const matchingChannel = supabase.channel("matches");

    matchingChannel.on<matche>(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "matches" },
      (payload) => {
        handleUpdateSignal(payload);
      }
    );

    matchingChannel.subscribe((status) => {
      if (status === "CHANNEL_ERROR") {
        setupMatchingChannel();
      } else if (status === "TIMED_OUT") {
        removeUserFromQueue(userInfo?.id as string);
      }
    });

    const roomId = await initiateMatching(userInfo);

    if (roomId) {
      await cleanUp();
      router.push(`/lesson/room?id=${roomId}`);
    }
  }, [cleanUp, handleUpdateSignal, isLoading, router, supabase, userInfo]);

  useEffect(() => {
    window.addEventListener("beforeunload", cleanUp);

    return () => {
      cleanUp();
      window.removeEventListener("beforeunload", cleanUp);
    };
  }, [cleanUp]);

  return { setupMatchingChannel, userInfo, isLoading, isMatching };
};

import { useRef, useState } from "react";
import { RealtimeChannel, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { initiateMatching } from "@/services/matchingService";
import { removeUserFromQueue } from "@/repositories/matchingRepository";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "./useUser";
import { matche } from "@/types/chatType/chatType";

export const useMatching = () => {
  const supabase = createClient();
  const [isMatching, setIsMatching] = useState(false); // 로딩 상태 추가
  const router = useRouter();
  const { userInfo, isLoading } = useUser();
  const matchingChannelRef = useRef<RealtimeChannel | null>(null);

  const setupMatchingChannel = async () => {
    if (!userInfo || isLoading || matchingChannelRef.current) return;

    setIsMatching(true);

    const matchingChannel = supabase.channel("matches");
    matchingChannelRef.current = matchingChannel;

    matchingChannel.on<matche>(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "matches" },
      (payload) => {
        console.log("update");
        handleUpdateSignal(payload);
      }
    );
    matchingChannel.subscribe(() => console.log("subscribe"));

    await initiateMatching(userInfo);

    // if (roomId) {
    //   setIsMatching(false);
    //   await cleanUp();
    //   router.push(`/lesson/room?id=${roomId}`);
    // }
  };

  const handleUpdateSignal = async (payload: RealtimePostgresUpdatePayload<matche>) => {
    const updatedMatchQueue = payload;
    if (updatedMatchQueue.new.user_id === userInfo?.id || updatedMatchQueue.new.match_id === userInfo?.id) {
      setIsMatching(false);
      await cleanUp();
      router.push(`/lesson/room?id=${updatedMatchQueue.new.room_id}`);
    }
  };

  const cleanUp = async () => {
    await matchingChannelRef.current?.unsubscribe();
    await removeUserFromQueue(userInfo?.id as string);
  };

  return { setupMatchingChannel, userInfo, isLoading, isMatching };
};

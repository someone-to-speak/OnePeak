import { useCallback, useEffect, useRef } from "react";
import { RealtimeChannel, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "./useUser";
import { matche } from "@/types/chatType/chatType";
import {
  removeUserFromMatchQueue,
  findUserFromMatchQueue,
  getSharedConversationId,
  updateUserFromMatchQueue,
  addUserToMatchQueue
} from "@/api/supabase";
import { UserInfo } from "@/types/userType/userType";
import { getRandomNumber } from "@/utils/randomNumber";
import { useMatchingStore } from "@/shared/StoreProvider";
import { v4 as uuidv4 } from "uuid";

export const useMatching = () => {
  const supabase = createClient();
  const router = useRouter();
  const { userInfo, isLoading } = useUser();
  const matchingChannelRef = useRef<RealtimeChannel | null>(null);
  const { isMatching, setIsMatching } = useMatchingStore((state) => state);

  const cleanUp = useCallback(async () => {
    if (matchingChannelRef.current) {
      await supabase.removeChannel(matchingChannelRef.current);
      if (userInfo?.id) {
        await removeUserFromMatchQueue(userInfo.id);
      }
    }
  }, [supabase, userInfo?.id]);

  const handleUpdateSignal = useCallback(
    async (payload: RealtimePostgresUpdatePayload<matche>) => {
      const updatedMatchQueue = payload.new;
      if (updatedMatchQueue.user_id === userInfo?.id) {
        setIsMatching(false);
        await cleanUp();
        router.push(`/lesson/room?id=${updatedMatchQueue.room_id}`);
      }
    },
    [cleanUp, setIsMatching, router, userInfo?.id]
  );

  const startMatching = async (userInfo: UserInfo) => {
    const { data: matchQueue } = await findUserFromMatchQueue(userInfo);

    if (matchQueue && matchQueue.length > 0) {
      const idx = getRandomNumber(matchQueue.length); // 랜덤 값 추출
      const matchPartner = matchQueue[idx];

      // 매칭 이력이 존재하는 사용자간의 대화방 id값 불러오기
      // 존재하지 않으면 새로운 id값 생성
      const roomId = (await getSharedConversationId(userInfo.id, matchPartner.user_id as string)) ?? uuidv4();

      // 매치 큐에서 조건에 맞는 사용자 데이터 업데이트
      // "UPDATE" 리스너를 통해 상대방도 라우트
      await updateUserFromMatchQueue(matchPartner.user_id as string, userInfo.id, roomId);
      return roomId;
    } else {
      await addUserToMatchQueue(userInfo);
      return null;
    }
  };

  const setupMatchingChannel = useCallback(async () => {
    if (!userInfo || isLoading) return;

    matchingChannelRef.current = supabase.channel("matches");

    matchingChannelRef.current
      .on<matche>("postgres_changes", { event: "UPDATE", schema: "public", table: "matches" }, (payload) => {
        handleUpdateSignal(payload);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const roomId = await startMatching(userInfo);
          if (roomId) {
            setIsMatching(false);
            await cleanUp();
            router.push(`/lesson/room?id=${roomId}`);
          }
        } else if (status === "CHANNEL_ERROR") {
          await setupMatchingChannel();
        } else if (status === "TIMED_OUT") {
        }
      });
  }, [setIsMatching, cleanUp, handleUpdateSignal, isLoading, router, supabase, userInfo]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanUp();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cleanUp]);

  return { isMatching, setIsMatching, setupMatchingChannel, cleanUp };
};

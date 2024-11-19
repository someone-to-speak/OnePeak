"use client";

import { createClient } from "@/utils/supabase/client";
import { RealtimePresenceState } from "@supabase/supabase-js";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface PresenceState {
  presence_ref: string;
  joinedAt: number;
}

export const useCallerCallee = (roomId: string) => {
  const supabase = createClient();
  const [role, setRole] = useState<"Caller" | "Callee" | null>(null);
  const userId = useRef<string>(uuidv4()); // 고유 사용자 ID 생성

  useEffect(() => {
    const channel = supabase.channel(`video-${roomId}`, {
      config: {
        presence: {
          key: userId.current // 고유 사용자 ID를 Presence key로 사용
        }
      }
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const users = channel.presenceState();
        const userKeys = Object.keys(users);

        // 역할 설정이 아직 안 된 경우에만 설정
        if (userKeys.length === 2) {
          const users = channel.presenceState() as RealtimePresenceState<PresenceState>;
          const allUsers = Object.keys(users).map((key) => ({
            id: key,
            joinedAt: users[key][0]?.joinedAt || Date.now() // 접속 시간
          }));

          // 접속 시간 기준 정렬
          allUsers.sort((a, b) => a.joinedAt - b.joinedAt);

          // 역할 설정
          if (allUsers[0]?.id === userId.current) {
            setRole("Callee"); // 가장 먼저 접속한 사용자는 Callee
          } else {
            setRole("Caller"); // 그 외 사용자는 Caller
          }
        }
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;
        await channel.track({ joinedAt: Date.now() });
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  return { role };
};

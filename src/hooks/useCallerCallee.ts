"use client";

import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useRef, useState, useEffect } from "react";
import { useUser } from "./useUser";

export const useCallerCallee = (roomId: string) => {
  const supabase = createClient();
  const [role, setRole] = useState<"Caller" | "Callee" | null>(null);
  const roleSet = useRef(false); // 역할 설정 여부 확인
  //   const channelRef = useRef<RealtimeChannel | null>(null);
  console.log("role", role);
  useEffect(() => {
    const channel = supabase.channel(`video-${roomId}`);

    channel
      .on("presence", { event: "sync" }, () => {
        const users = channel.presenceState();
        const userKeys = Object.keys(users);
        console.log("users", users);
        console.log("userKeys", userKeys.length);

        // 역할 설정이 아직 안 된 경우에만 설정
        if (!roleSet.current) {
          if (userKeys.length === 1) {
            setRole("Callee");
          } else if (userKeys.length === 2) {
            setRole("Caller");
          }
          roleSet.current = true; // 역할 설정 완료
        }
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }
        await channel.track({ event: "join" });
        console.log("track");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);
};

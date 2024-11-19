"use client";

import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useRef, useState, useEffect } from "react";
import { useUser } from "./useUser";

export const useCallerCallee = (roomId: string) => {
  const supabase = createClient();
  const [role, setRole] = useState<"Caller" | "Calles" | null>(null);
  //   const channelRef = useRef<RealtimeChannel | null>(null);

  const { userInfo } = useUser();

  useEffect(() => {
    const channel = supabase.channel(`video-${roomId}`);

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
        console.log("newState", newState);
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }
        await channel.track({ user: userInfo?.id });
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase, userInfo?.id]);
};

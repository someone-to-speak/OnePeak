"use client";

import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useRef, useState, useEffect } from "react";
import { useUser } from "./useUser";

export const useCallerCallee = (roomId: string) => {
  const supabase = createClient();
  const [role, setRole] = useState<"Caller" | "Calles" | null>(null);
  //   const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabase.channel(`video-${roomId}`);

    channel
      .on("presence", { event: "sync" }, () => {
        const users = channel.presenceState();
        const userKeys = Object.keys(users);
        console.log("users", users);
        console.log("userKeys", userKeys);
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

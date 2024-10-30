"use server";

import { createClient } from "@/utils/supabase/server";
import { RealtimeChannel } from "@supabase/supabase-js";

export const getUserId = async () => {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user?.id;
};

export const createChannel = (roomId: string): RealtimeChannel => {
  const supabase = createClient();
  return supabase.channel(`video-chat-${roomId}`);
};

import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { UUID } from "crypto";

const supabase = createClient();

export const createChannel = (roomId: string): RealtimeChannel => {
  const supabase = createClient();
  return supabase.channel(`video-chat-${roomId}`);
};

export const getOrCreateConversationId = async (conversationId: UUID) => {
  const { data: conversationData } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .maybeSingle();

  !conversationData && (await supabase.from("conversations").insert({ id: conversationId }));
};

export const checkOrAddParticipant = async (conversationId: UUID, participantId: string) => {
  console.log("participantId: ", participantId);
  const { data: existingParticipant } = await supabase
    .from("participants")
    .select("id")
    .eq("user_id", participantId)
    .eq("conversation_id", conversationId)
    .maybeSingle();

  if (existingParticipant) return;

  !existingParticipant &&
    (await supabase.from("participants").insert({
      conversation_id: conversationId
    }));
};

export const insertMessage = async (conversationId: UUID, content: string, type: string) => {
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    content,
    type
  });
};

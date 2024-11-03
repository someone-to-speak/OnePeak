import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

const supabase = createClient();

export const createChannel = (roomId: string): RealtimeChannel => {
  const supabase = createClient();
  return supabase.channel(`video-chat-${roomId}`);
};

export const getOrCreateConversationId = async (conversationId: string) => {
  const { data: conversationData } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .single();

  !conversationData && (await supabase.from("conversations").insert({ id: conversationId }));
};

export const checkOrAddParticipant = async (conversationId: string, participantId: string) => {
  const { data: existingParticipant } = await supabase
    .from("participants")
    .select("id")
    .eq("user_id", participantId)
    .eq("conversation_id", conversationId)
    .single();

  !existingParticipant &&
    (await supabase.from("participants").insert({
      user_id: participantId,
      conversation_id: conversationId
    }));
};

export const insertMessage = async (conversationId: string, senderId: string, content: string, type: string) => {
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: senderId,
    content,
    type
  });
};

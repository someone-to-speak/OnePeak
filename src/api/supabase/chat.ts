import { ConversationWithParticipants, MessageWithUserInfo } from "@/types/chatType/chatType";
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

// 채팅방 리스트 불러오기
export const fetchConversationList = async (userId: string) => {
  const { data: participantData } = await supabase.from("participants").select("*").eq("user_id", userId);

  const conversationIds = participantData?.map((participant) => participant.conversation_id);

  const { data: conversationList } = await supabase
    .from("conversations")
    .select(
      `
      *,
      last_message: last_message_id(*)
  `
    )
    .in("id", conversationIds as string[])
    .order("updated_at", { ascending: false });

  const conversationListWithParticipants = await Promise.all(
    conversationList?.map(async (conversation) => {
      const { data: participants } = await supabase
        .from("participants")
        .select("*, user_info: user_id(*, my_language(*))")
        .eq("conversation_id", conversation.id)
        .neq("user_id", userId)
        .maybeSingle();

      return { ...conversation, participants };
    }) || []
  );

  return conversationListWithParticipants as ConversationWithParticipants[];
};

// 메시지 불러오기
export const fetchMessages = async (conversationId: string) => {
  const { data: Messages } = await supabase
    .from("messages")
    .select("*, user_info: sender_id(*)")
    .eq("conversation_id", conversationId);
  return Messages as MessageWithUserInfo[];
};

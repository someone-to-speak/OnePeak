import {
  ConversationWithParticipants,
  Message,
  MessageWithUserInfo,
  UserInfoWithLanguage
} from "@/types/chatType/chatType";
import { UserInfo } from "@/types/userType/userType";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { UUID } from "crypto";

export const createChannel = (roomId: string): RealtimeChannel => {
  const supabase = createClient();
  return supabase.channel(`video-chat-${roomId}`);
};

export const getOrCreateConversationId = async (conversationId: UUID) => {
  const supabase = createClient();
  const { data: conversationData } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .maybeSingle();

  // !conversationData && (await supabase.from("conversations").insert({ id: conversationId }));
  if (!conversationData) await supabase.from("conversations").insert({ id: conversationId });
};

export const checkOrAddParticipant = async (conversationId: UUID, participantId: string) => {
  const supabase = createClient();
  const { data: existingParticipant } = await supabase
    .from("participants")
    .select("id")
    .eq("user_id", participantId)
    .eq("conversation_id", conversationId)
    .maybeSingle();

  if (!existingParticipant)
    await supabase.from("participants").insert({
      conversation_id: conversationId
    });
};

export const insertMessage = async (conversationId: string, content: string, type: string) => {
  const supabase = createClient();
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    content,
    type
  });
};

// 채팅방 리스트 불러오기
export const fetchConversationList = async (userId: string) => {
  const supabase = createClient();
  const { data: participantData } = await supabase.from("participants").select("*").eq("user_id", userId);

  const conversationIds = participantData?.map((participant) => participant.conversation_id);

  const { data: conversationList } = await supabase
    .from("conversations")
    .select(
      `
      *,
      last_message_id(*)
  `
    )
    .in("id", conversationIds as string[])
    .order("updated_at", { ascending: false });

  const formattedConversationList = conversationList?.map((list) => ({
    ...list,
    last_message_id: (list?.last_message_id || {}) as Message
  }));

  const conversationListWithParticipants = await Promise.all(
    formattedConversationList?.map(async (conversation) => {
      const { data: participants } = await supabase
        .from("participants")
        .select("*, user_info: user_id(*, my_language(*), learn_language(*))")
        .eq("conversation_id", conversation.id)
        .neq("user_id", userId)
        .maybeSingle();

      return {
        ...conversation,
        participants: {
          ...participants,
          user_info: (participants?.user_info || {}) as UserInfoWithLanguage
        }
      };
    }) || []
  );

  return conversationListWithParticipants as ConversationWithParticipants[];
};

// 메시지 불러오기
export const fetchMessages = async (conversationId: string) => {
  const supabase = createClient();
  const { data: messages } = await supabase
    .from("messages")
    .select("*, sender_id(*)")
    .eq("conversation_id", conversationId);

  const formattedMessages = messages?.map((message) => ({
    ...message,
    sender_id: (message.sender_id || {}) as UserInfo
  }));

  return formattedMessages as MessageWithUserInfo[];
};

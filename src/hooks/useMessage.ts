import { createClient } from "@/utils/supabase/client";
import { useUser } from "./useUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMessages, insertMessage } from "@/api/supabase/chat";
import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";

export const useMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { userInfo } = useUser();
  const matchingChannelRef = useRef<RealtimeChannel | null>(null);

  const {
    data: messages,
    isLoading,
    isError
  } = useQuery<MessageWithUserInfo[]>({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!userInfo
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: ({ content }: { content: string }) => insertMessage(conversationId, content, "text"),
    onMutate: async ({ content }: { content: string }) => {
      await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });

      // 현재 메시지 목록을 가져옵니다.
      const previousMessages = queryClient.getQueryData<MessageWithUserInfo[]>(["messages", conversationId]);

      const newMessage = {
        id: uuidv4(),
        coach_content: "",
        content: content,
        conversation_id: conversationId,
        created_at: new Date().toISOString(),
        sender_id: userInfo,
        stt_content: "",
        type: "text"
      };

      // 새로운 메시지를 추가합니다.
      queryClient.setQueryData<MessageWithUserInfo[]>(["messages", conversationId], (old) => [
        ...(old || []),
        newMessage as MessageWithUserInfo
      ]);

      // 이전 상태를 반환하여 rollback 할 수 있도록 합니다.
      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      // Rollback on error
      queryClient.setQueryData(["messages", conversationId], context?.previousMessages);
    },
    onSettled: () => {
      // 데이터가 성공적으로 변경된 후 재-fetch
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    }
  });

  // 채널로 메시지 전송
  const sendMessageToChannel = async ({ content }: { content: string }) => {
    if (matchingChannelRef.current) {
      const newMessage = {
        id: uuidv4(),
        coach_content: "",
        content: content,
        conversation_id: conversationId,
        created_at: new Date().toISOString(),
        sender_id: userInfo,
        stt_content: "",
        type: "text"
      };

      await matchingChannelRef.current.send({
        type: "broadcast",
        event: "INSERT",
        payload: newMessage
      });
    }
  };

  useEffect(() => {
    const channel = supabase.channel(`conversation-${conversationId}`);
    matchingChannelRef.current = channel;

    channel
      .on("broadcast", { event: "INSERT" }, (payload) => {
        const newMessage = payload.new as MessageWithUserInfo;

        // Check if the message is already in the cache to avoid duplicates
        queryClient.setQueryData<MessageWithUserInfo[]>(["messages", conversationId], (old) => {
          return old?.some((msg) => msg.id === newMessage.id) ? old : [...(old || []), newMessage];
        });
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, queryClient, supabase]);

  return { messages, isLoading, isError, sendMessage, sendMessageToChannel };
};

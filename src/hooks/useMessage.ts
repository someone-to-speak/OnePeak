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
  const channel = useRef<RealtimeChannel | null>(null);

  const {
    data: messages,
    isFetched,
    isError
  } = useQuery<MessageWithUserInfo[]>({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!userInfo?.id
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

    await channel.current?.send({
      type: "broadcast",
      event: "INSERT",
      payload: newMessage
    });
  };

  useEffect(() => {
    channel.current = supabase.channel(`conversation-${conversationId}`);

    channel.current
      .on<MessageWithUserInfo>("broadcast", { event: "INSERT" }, async ({ payload }) => {
        await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });

        const newMessage = payload as MessageWithUserInfo;

        queryClient.setQueryData<MessageWithUserInfo[]>(["messages", conversationId], (old) => {
          const newMessages = [...(old || []), newMessage];
          return newMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        });
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
      channel.current = null;
    };
  }, [conversationId, queryClient, supabase]);

  return { messages, isFetched, isError, sendMessage, sendMessageToChannel };
};

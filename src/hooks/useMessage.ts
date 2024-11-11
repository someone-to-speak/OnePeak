// import { createClient } from "@/utils/supabase/client";
import { useUser } from "./useUser";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { fetchMessages, insertMessage } from "@/api/supabase/chat";
import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { v4 as uuidv4 } from "uuid";

export const useMessage = (conversationId: string) => {
  const queryClient = new QueryClient();
  // const supabase = createClient();
  const { userInfo } = useUser();
  console.log("conversationId1: ", conversationId);
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
      console.log("conversationId2: ", conversationId);
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
      console.log("newMessage: ", newMessage);
      // 새로운 메시지를 추가합니다.
      queryClient.setQueryData<MessageWithUserInfo[]>(["messages", conversationId], (old) => [
        ...(old || []),
        newMessage as MessageWithUserInfo
      ]);
      console.log("previousMessages: ", previousMessages);
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

  return { messages, isLoading, isError, sendMessage };
};

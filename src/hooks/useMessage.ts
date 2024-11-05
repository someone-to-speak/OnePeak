import { createClient } from "@/utils/supabase/client";
import { useUser } from "./useUser";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { fetchMessages, insertMessage } from "@/api/supabase/chat";
import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { UUID } from "crypto";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();
const queryClient = new QueryClient();

export const useMessage = (conversationId: UUID) => {
  const { userInfo } = useUser();

  const {
    data: messages,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!userInfo?.id
  });

  //   const { mutate: sendMessage } = useMutation({
  //     mutationFn: ({ content }: { content: string }) => insertMessage(conversationId, content, "text")
  //     onMutate: async (message) => {
  //         await queryClient.cancelQueries({queryKey: ['messages', conversationId]});

  //         // 현재 메시지 목록을 가져옵니다.
  //         const previousMessages = queryClient.getQueryData<MessageWithUserInfo[]>(['messages', conversationId]);

  //         const newMessage = {
  //             id: uuidv4(),
  //             coach_content: "",
  //             content: message.content,
  //             conversation_id: conversationId,
  //             created_at: new Date().toISOString(),
  //             sender_id: userId,
  //             stt_content: "",
  //             type: 'text',
  //             user_info: []
  //         }

  //         // 새로운 메시지를 추가합니다.
  //         queryClient.setQueryData<MessageWithUserInfo[]>(['messages', conversationId], (old) => [...(old || []), newMessage]);

  //         // 이전 상태를 반환하여 rollback 할 수 있도록 합니다.
  //         return { previousMessages };
  //       },
  //       onError: (err, newMessage, context) => {
  //         // Rollback on error
  //         queryClient.setQueryData(['messages', conversationId], context?.previousMessages);
  //       },
  //       onSettled: () => {
  //         // 데이터가 성공적으로 변경된 후 재-fetch
  //         queryClient.invalidateQueries({queryKey: ['messages', conversationId]});
  //       }
  //   });

  return { messages, isLoading, isError };
};

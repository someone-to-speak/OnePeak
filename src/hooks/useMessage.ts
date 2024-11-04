import { createClient } from "@/utils/supabase/client";
import { useUser } from "./useUser";
import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "@/api/supabase/chat";
import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { UUID } from "crypto";

const supabase = createClient();

export const useMessage = (conversationId: UUID) => {
  const { userId } = useUser();

  const {
    data: messages,
    isLoading,
    isError
  } = useQuery<MessageWithUserInfo[]>({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!userId
  });

  return { messages, isLoading, isError };
};

import { fetchConversationList } from "@/api/supabase/chat";
import { getUserId } from "@/api/supabase/user";
import { Conversation } from "@/types/chatType/chatType";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";

const supabase = createClient();

export const useConversation = () => {
  const { userId } = useUser();

  // 채팅방 리스트 불러오기
  const {
    data: conversationList,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["conversation", userId],
    queryFn: () => fetchConversationList(userId as string),
    enabled: !!userId
  });

  return { conversationList, isLoading, isError };
};

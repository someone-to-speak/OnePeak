import { fetchConversationList } from "@/api/supabase/chat";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";

const supabase = createClient();

export const useConversation = () => {
  const { userInfo } = useUser();

  // 채팅방 리스트 불러오기
  const {
    data: conversationList,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["conversation", userInfo?.id],
    queryFn: () => fetchConversationList(userInfo?.id as string),
    enabled: !!userInfo?.id
  });

  return { conversationList, isLoading, isError };
};

import { fetchConversationList } from "@/api/supabase/chat";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";

export const useConversation = () => {
  const { userInfo } = useUser();

  // 채팅방 리스트 불러오기
  const {
    data: conversationList,
    isFetched,
    isError
  } = useQuery({
    queryKey: ["conversation", userInfo?.id],
    queryFn: () => fetchConversationList(userInfo?.id as string),
    enabled: !!userInfo?.id
  });

  return { conversationList, isFetched, isError };
};

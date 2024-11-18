import { UserInfo, UserInfoForMatching } from "@/types/userType/userType";
import { createClient } from "@/utils/supabase/client";

export const getUserForMatching = async () => {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();

  const userId = auth.user?.id;
  const { data } = await supabase
    .from("user_info")
    .select("id, my_language, learn_language")
    .eq("id", userId as string)
    .single();

  return data as UserInfoForMatching;
};

export const addUserToMatchQueue = async (userInfo: UserInfo) => {
  const supabase = createClient();
  return await supabase.from("matches").insert({
    user_id: userInfo.id,
    my_language: userInfo.my_language,
    learn_language: userInfo.learn_language
  });
};

export const getExistingQueue = async (userInfo: UserInfo) => {
  const supabase = createClient();
  return await supabase.from("matches").select("*").eq("user_id", userInfo.id).is("match_id", null);
};

// "본인 제외" 매치 큐에서 조건에 맞는 사용자 불러오기
export const findUserFromMatchQueue = async (userInfo: UserInfo) => {
  const supabase = createClient();
  return await supabase
    .from("matches")
    .select("*")
    .is("match_id", null)
    .eq("my_language", userInfo.learn_language as string)
    .neq("user_id", userInfo.id);
};

export const updateUserFromMatchQueue = async (partnerUserId: string, matchId: string, roomId: string) => {
  const supabase = createClient();
  return await supabase.from("matches").update({ match_id: matchId, room_id: roomId }).eq("user_id", partnerUserId);
};

export const removeUserFromMatchQueue = async (userId: string) => {
  const supabase = createClient();
  return await supabase.from("matches").delete().eq("user_id", userId);
};

export async function getSharedConversationId(myId: string, userId: string) {
  const supabase = createClient();
  const { data } = await supabase.from("participants").select("*").in("user_id", [myId, userId]);

  if (!data || data.length === 0) {
    return null;
  }

  const conversationId = data
    .map((item) => item.conversation_id)
    .find((id) => data.filter((item) => item.conversation_id === id).length === 2);

  return conversationId;
}

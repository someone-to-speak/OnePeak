import { UserInfo } from "@/types/userType/userType";
import { createClient } from "@/utils/supabase/server";

export const getUserServer = async () => {
  const serverClient = createClient();
  const {
    data: { user }
  } = await serverClient.auth.getUser();

  const { data: userInfo } = await serverClient
    .from("user_info")
    .select("*")
    .eq("id", user?.id as string)
    .maybeSingle();

  return userInfo as UserInfo;
};

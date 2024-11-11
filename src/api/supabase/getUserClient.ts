import { UserInfo } from "@/types/userType/userType";
import { createClient } from "@/utils/supabase/client";

export const getUserClient = async () => {
  const browserClient = createClient();
  const {
    data: { user }
  } = await browserClient.auth.getUser();

  const { data: userInfo } = await browserClient
    .from("user_info")
    .select("*, my_language(*), learn_language(*)")
    .eq("id", user?.id as string)
    .maybeSingle();

  return userInfo as UserInfo;
};

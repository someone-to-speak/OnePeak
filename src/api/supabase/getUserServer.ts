import { UserInfo } from "@/types/userType/userType";
import { createClient } from "@/utils/supabase/server";

export const getUserClient = async () => {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: userInfo } = await supabase
    .from("user_info")
    .select("*")
    .eq("id", user?.id as string)
    .maybeSingle();

  return userInfo as UserInfo;
};
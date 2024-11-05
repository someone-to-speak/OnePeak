import { UserInfo } from "@/types/userType/userType";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getUser = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: userInfo } = await supabase
    .from("user_info")
    .select("*")
    .eq("id", user?.id as string)
    .single();

  return userInfo as UserInfo;
};

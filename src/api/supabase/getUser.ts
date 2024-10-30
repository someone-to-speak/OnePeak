"use server";

import { userInfoForMatching } from "@/types/UserInfo";
import { createClient } from "@/utils/supabase/server";

export const getUser = async (): Promise<userInfoForMatching | null> => {
  const supabase = createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    return null;
  }

  const userId = auth.user?.id;
  const { data, error } = await supabase
    .from("user_info")
    .select("id, my_language, learn_language")
    .eq("id", userId)
    .single();
  if (!data || error) {
    return null;
  }

  return data;
};

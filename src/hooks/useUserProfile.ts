import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../database.types";

type UserProfileType = Pick<Tables<"user_info">, "id" | "nickname" | "profile_url" | "state_msg"> & {
  my_language: { language_img_url: string; language_name: string } | null;
  learn_language: { language_img_url: string; language_name: string } | null;
};

export const getUserProfile = async (userId: string): Promise<UserProfileType | null> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("user_info")
    .select(
      "id, nickname, profile_url, state_msg, my_language:language!user_info_my_language_fkey(language_img_url,language_name), learn_language:language!user_info_learn_language_fkey(language_img_url,language_name)"
    )
    .eq("id", userId)
    .single();

  return data || null;
};

export const useUserProfile = (userId: string) => {
  return useQuery<UserProfileType | null>({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId
  });
};

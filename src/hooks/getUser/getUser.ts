import { getUser } from "@/api/supabase/getUser";
import { UserInfoForMatching } from "@/types/UserInfo";
import { useQuery } from "@tanstack/react-query";

export const useUserInfoForMatching = () => {
  return useQuery<UserInfoForMatching | null>({
    queryKey: ["userInfoForMatching"],
    queryFn: () => getUser()
  });
};

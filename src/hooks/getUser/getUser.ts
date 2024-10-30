import { getUser } from "@/api/supabase/getUser";
import { userInfoForMatching } from "@/types/UserInfo";
import { useQuery } from "@tanstack/react-query";

export const useUserInfoForMatching = () => {
  return useQuery<userInfoForMatching | null>({
    queryKey: ["userInfoForMatching"],
    queryFn: () => getUser()
  });
};

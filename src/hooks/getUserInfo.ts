import { getUserId } from "@/api/supabase/user";
import { getUserForMatching } from "@/repositories/matchingRepository";
import { UserInfoForMatching } from "@/types/userType.ts/userType";

import { useQuery } from "@tanstack/react-query";
import { UUID } from "crypto";

export const useUserInfoForMatching = () => {
  return useQuery<UserInfoForMatching>({
    queryKey: ["userInfoForMatching"],
    queryFn: async () => await getUserForMatching()
  });
};

export const useUserInfo = () => {
  return useQuery<string>({
    queryKey: ["userInfo"],
    queryFn: async () => await getUserId()
  });
};

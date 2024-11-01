import { getUserId } from "@/repositories/clientRepository";
import { getUserForMatching } from "@/repositories/matchingRepository";
import { UserInfoForMatching } from "@/types/userType.ts/userType";

import { useQuery } from "@tanstack/react-query";

export const useUserInfoForMatching = () => {
  return useQuery<UserInfoForMatching>({
    queryKey: ["userInfoForMatching"],
    queryFn: () => getUserForMatching()
  });
};

export const useUserInfo = () => {
  return useQuery<string>({
    queryKey: ["userInfo"],
    queryFn: () => getUserId()
  });
};

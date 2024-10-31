import { getUserForMatching } from "@/repositories/matchingRepository";
import { UserInfoForMatching } from "@/types/user/UserInfo";
import { useQuery } from "@tanstack/react-query";

export const useUserInfoForMatching = () => {
  return useQuery<UserInfoForMatching>({
    queryKey: ["userInfoForMatching"],
    queryFn: () => getUserForMatching()
  });
};

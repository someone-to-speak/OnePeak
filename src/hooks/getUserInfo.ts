import { getUserId } from "@/repositories/clientRepository";
import { getUserForMatching } from "@/repositories/matchingRepository";
import { UserInfoForMatching } from "@/types/user/UserInfo";
import { useQuery } from "@tanstack/react-query";

export const useUserInfoForMatching = () => {
  return useQuery<UserInfoForMatching>({
    queryKey: ["userInfoForMatching"],
    queryFn: async () => getUserForMatching()
  });
};

export const useUserInfo = () => {
  return useQuery<string>({
    queryKey: ["userInfoFo"],
    queryFn: async () => getUserId()
  });
};

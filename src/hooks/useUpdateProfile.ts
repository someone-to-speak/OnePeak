import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../database.types";

type UserInfoType = Tables<"user_info">;

export const useUpdateProfile = () => {
  const supabase = createClient();

  return useMutation<void, Error, UserInfoType>({
    mutationFn: async ({ id, nickname, state_msg, profile_url }) => {
      const { error } = await supabase
        .from("user_info")
        .update({
          nickname,
          state_msg,
          profile_url
        })
        .eq("id", id);

      if (error) throw new Error("프로필 업데이트에 실패했습니다.");
    },
    onError: (error) => {
      alert(error.message || "프로필 업데이트 중 오류가 발생했습니다.");
    },
    onSuccess: () => {
      alert("프로필이 성공적으로 업데이트되었습니다.");
    }
  });
};

export const useGetProfile = () => {
  const supabase = createClient();

  return useMutation<void, Error, UserInfoType>({
    mutationFn: async ({ id }) => {
      const { error } = await supabase.from("user_info").select("nickname,state_msg,profile_url").eq("id", id);

      if (error) throw new Error("프로필 가져오기에 실패했습니다.");
    },
    onError: (error) => {
      alert(error.message || "프로필 가져오기 중 오류가 발생했습니다.");
    },
    onSuccess: () => {}
  });
};

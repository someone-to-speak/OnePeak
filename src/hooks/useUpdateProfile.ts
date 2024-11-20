import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { uploadImage } from "@/utils/myPage/imageUpload";
import { useUser } from "./useUser";

const updateUserProfile = async ({
  userId,
  nickname,
  state_msg,
  file,
  changedProfileUrl
}: {
  userId: string;
  nickname: string;
  state_msg: string;
  file?: File;
  changedProfileUrl: string;
}) => {
  const supabase = createClient();

  // 이미지 업로드 처리
  if (file) {
    try {
      const data = await uploadImage(file);
      changedProfileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Profile_url/${data.path}`;
    } catch {
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  }

  // 프로필 정보 업데이트
  const { error } = await supabase
    .from("user_info")
    .update({
      nickname,
      profile_url: changedProfileUrl,
      state_msg
    })
    .eq("id", userId);

  if (error) {
    throw new Error("프로필 업데이트에 실패했습니다.");
  }

  return true;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useUser();

  return useMutation({
    mutationFn: updateUserProfile,
    onMutate: async ({ userId, nickname, state_msg }) => {
      if (!userId || !userInfo) return;

      // 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["userProfile", userId] });

      // 새로 업데이트될 프로필 데이터 (기존 URL을 사용)
      const currentProfileUrl = userInfo.profile_url || "";

      const updatedProfile = {
        userId,
        nickname,
        state_msg,
        profile_url: currentProfileUrl // 파일이 없을 경우 기존 URL 사용
      };

      // 새로운 프로필을 임시로 업데이트
      queryClient.setQueryData(["userProfile", userId], updatedProfile);
    },
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (error) => {
      if (userInfo?.id) {
        // 데이터가 성공적으로 업데이트된 후 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: ["userProfile", userInfo.id] });
        if (!error) {
        }
      }
    }
  });
};

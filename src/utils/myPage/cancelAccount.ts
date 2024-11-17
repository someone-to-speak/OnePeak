import { createClient } from "../supabase/client";

interface UserInfo {
  id: string;
}

interface CancelAccountProps {
  userInfo: UserInfo;
  handleLogout: () => void;
  onConfirm: () => boolean; // onConfirm은 boolean 반환
}

export const cancelAccount = async ({ userInfo, handleLogout, onConfirm }: CancelAccountProps) => {
  const supabase = createClient();

  if (!userInfo?.id) return;

  // onConfirm 실행 결과가 true인 경우에만 탈퇴 로직 진행
  if (onConfirm()) {
    try {
      const { data, error } = await supabase.from("user_info").update({ is_deleted: true }).eq("id", userInfo.id);

      if (error) throw new Error(error.message);

      if (data) {
        handleLogout(); // 로그아웃 실행
      }
    } catch (err) {
      console.error("회원탈퇴 오류:", err);
    }
  }
};

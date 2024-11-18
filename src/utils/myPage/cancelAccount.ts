import { createClient } from "../supabase/client";

interface UserInfo {
  id: string;
}

interface CancelAccountProps {
  userInfo: UserInfo;
  handleLogout: () => void;
  onConfirm: () => true;
}

export const cancelAccount = async ({ userInfo, handleLogout, onConfirm }: CancelAccountProps) => {
  const supabase = createClient();

  if (!userInfo) return;

  if (onConfirm()) {
    try {
      const { data, error } = await supabase.from("user_info").update({ is_deleted: true }).eq("id", userInfo.id);

      if (error) throw new Error(error.message);

      if (data) {
        handleLogout();
      }
    } catch (err) {
      console.error("회원탈퇴 오류:", err);
    }
  }
};

// CancelAccount.ts
import { confirmToast } from "@/components/ui/toast/ConfirmToast";
import { toast } from "react-toastify";
import { createClient } from "../supabase/client";

interface UserInfo {
  id: string;
}

interface CancelAccountProps {
  userInfo: UserInfo | null;
  handleLogout: () => void;
}

export const cancelAccount = async ({ userInfo, handleLogout }: CancelAccountProps) => {
  const supabase = createClient();
  if (!userInfo?.id) return;

  confirmToast({
    message: "정말 회원 계정을 탈퇴하시겠습니까?",
    onConfirm: async () => {
      try {
        const { error } = await supabase.from("user_info").update({ is_deleted: true }).eq("id", userInfo.id);
        if (error) throw error;
        handleLogout();
      } catch {
        toast.error("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
      }
    }
  });
};

import { createClient } from "@/utils/supabase/client";

export async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error as Error) {
    throw new Error("로그아웃에 실패했습니다.");
  }
  window.location.reload();
}

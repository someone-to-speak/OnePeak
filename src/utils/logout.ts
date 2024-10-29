import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("로그아웃 오류:", error.message);
    throw new Error("로그아웃에 실패했습니다.");
  } else {
    alert("로그아웃이 성공적으로 완료되었습니다.");
    console.log("로그아웃");
  }
  const {
    data: { session }
  } = await supabase.auth.getSession();
  console.log("현재 세션:", session);
}

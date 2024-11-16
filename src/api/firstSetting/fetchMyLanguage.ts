import { createClient } from "@/utils/supabase/client";

// 'user_info'테이블에서 'my_language'만 가져오는 함수
export const fetchMyLanguage = async (userId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.from("user_info").select("my_language").eq("id", userId).single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

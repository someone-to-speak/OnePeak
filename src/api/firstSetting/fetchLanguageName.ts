import { createClient } from "@/utils/supabase/client";

type LanguageName = { language_name: string };

// 'language'테이블에서 status가 true인 'language_name'만 가져오는 함수(=지원 중인 언어)
export const fetchLanguageName = async (): Promise<LanguageName[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("language").select("language_name").eq("status", true);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

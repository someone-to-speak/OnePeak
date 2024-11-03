import { createClient } from "@/utils/supabase/client";
// import { Tables } from "../../../database.types";

type LanguageName = { language_name: string };
const supabase = createClient();

// 'language'테이블에서 'language_name'만 가져오는 함수
export const fetchLanguageName = async (): Promise<LanguageName[]> => {
  const { data, error } = await supabase.from("language").select("language_name");
  console.log("지원언어", data);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

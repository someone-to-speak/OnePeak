import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../database.types";

type QuestionsType = Tables<"questions">;

// 'questions' 테이블에서 단어문제만 가져오는 함수
export const fetchWordQuestions = async (): Promise<QuestionsType[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("questions").select("*").eq("type", "word");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

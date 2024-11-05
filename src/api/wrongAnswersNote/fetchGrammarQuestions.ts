import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../database.types";

type QuestionsType = Tables<"questions">;

// 'questions' 테이블에서 문법문제만 가져오는 함수
export const fetchGrammarQuestions = async (): Promise<QuestionsType[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("questions").select("*").eq("type", "grammar");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

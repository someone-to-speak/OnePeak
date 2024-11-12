import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../database.types";

type QuestionsType = Tables<"questions">;
type UserAnswerType = Tables<"user_answer">;

// 'questions' 테이블에서 문법문제만 가져오는 함수
export const fetchGrammarQuestions = async (): Promise<QuestionsType[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("questions").select("*").eq("type", "grammar");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// 'questions' 테이블에서 단어문제만 가져오는 함수
export const fetchWordQuestions = async (): Promise<QuestionsType[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("questions").select("*").eq("type", "word");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// 'user_answer' 테이블에서 틀린문제만 가져오는 함수 정의
export const fetchUserWrongAnswers = async (userId: string): Promise<UserAnswerType[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_answer")
    .select("*")
    .eq("user_id", userId)
    .eq("is_corrected", false);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

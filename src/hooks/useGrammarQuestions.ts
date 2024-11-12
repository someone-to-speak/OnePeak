import { QuestionsType } from "@/types/\bwrongAnswerNote";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useGrammarQuestions = () => {
  const fetchGrammarQuestions = async (): Promise<QuestionsType[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("questions").select("*").eq("type", "grammar");

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  return useQuery({
    queryKey: ["questions", "grammar"],
    queryFn: fetchGrammarQuestions,
    staleTime: 0
  });
};

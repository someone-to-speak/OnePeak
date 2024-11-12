import { QuestionsType } from "@/types/wrongAnswerNote";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useWordQuestions = () => {
  const fetchWordQuestions = async (): Promise<QuestionsType[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("questions").select("*").eq("type", "word");

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  return useQuery({
    queryKey: ["questions"],
    queryFn: fetchWordQuestions,
    staleTime: 0
  });
};

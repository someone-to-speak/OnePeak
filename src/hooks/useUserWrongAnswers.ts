import { UserAnswerType } from "@/types/\bwrongAnswerNote";
import { createClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";

export const useUserWrongAnswers = (userId: string) => {
  const fetchUserWrongAnswers = async (): Promise<UserAnswerType[]> => {
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

  return useQuery({
    queryKey: ["userAnswers", userId],
    queryFn: fetchUserWrongAnswers,
    staleTime: 0
  });
};

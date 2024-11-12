// import { createClient } from "@/utils/supabase/client";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// export const useUpdateIsReviewed = (userId: string) => {
//   const queryClient = useQueryClient();
//   const supabase = createClient();

//   const updateIsReviewed = async (answerId: number, currentReviewed: boolean) => {
//     const { error } = await supabase.from("user_answer").update({ is_reviewed: !currentReviewed }).eq("id", answerId);

//     if (error) {
//       throw new Error(error.message);
//     }
//   };

//   return useMutation({
//     mutationFn: ({ answerId, currentReviewed }: { answerId: number; currentReviewed: boolean }) =>
//       updateIsReviewed(answerId, currentReviewed),
//     onSuccess: () => {
//       // userAnswers 쿼리 무효화하여 데이터를 새로고침
//       queryClient.invalidateQueries({ queryKey: ["userAnswers", userId] });
//     }
//   });
// };

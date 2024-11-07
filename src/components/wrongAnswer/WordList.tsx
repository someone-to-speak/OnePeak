"use client";

import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchUserWrongAnswers } from "@/api/wrongAnswersNote/fetchUserWrongAnswers";
import { fetchWordQuestions } from "@/api/wrongAnswersNote/fetchWordQuestions";
import Image from "next/image";
import noActiveCheck from "@/assets/noactive-check.svg";
import activeCheck from "@/assets/active-check.svg";

const WordList = ({ userId }: { userId: string }) => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [isReviewed, setIsReviewed] = useState<"미완료" | "완료">("미완료");

  const {
    data: userAnswers,
    error: userAnswersError,
    isLoading: userAnswersLoading
  } = useQuery({
    queryKey: ["userAnswers", userId],
    queryFn: () => fetchUserWrongAnswers(userId),
    staleTime: 0
  });

  const {
    data: questions,
    error: questionsError,
    isLoading: questionsLoading
  } = useQuery({
    queryKey: ["questions"],
    queryFn: () => fetchWordQuestions(),
    staleTime: 0
  });

  const updateIsReviewed = useMutation({
    mutationFn: async ({ answerId, currentReviewed }: { answerId: number; currentReviewed: boolean }) => {
      const { error } = await supabase.from("user_answer").update({ is_reviewed: !currentReviewed }).eq("id", answerId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAnswers", userId] });
    }
  });

  if (userAnswersLoading || questionsLoading) return <p>Loading...</p>;
  if (userAnswersError) return <p>{userAnswersError.message}</p>;
  if (questionsError) return <p>{questionsError.message}</p>;

  const filteredAnswers = userAnswers
    ?.filter((answer) => (isReviewed === "미완료" ? !answer.is_reviewed : answer.is_reviewed))
    .map((answer) => {
      const matchedQuestion = questions?.find((question) => question.id === answer.question_id);
      return matchedQuestion ? { ...matchedQuestion, answerId: answer.id, isReviewed: answer.is_reviewed } : null;
    })
    .filter((item) => item !== null);

  return (
    <div>
      <div className="bg-[#f3f3f3] flex my-4 rounded-[22px] w-[343px] h-[46px] p-2.5 justify-center items-center">
        <button
          className={`${
            isReviewed === "미완료"
              ? "w-[163px] h-[38px] p-2.5 rounded-[22px] justify-center items-center inline-flex bg-[#b0e484] text-white"
              : "bg-[#f3f3f3] text-gray-600 w-[163px] h-[38px] p-2.5 rounded-[22px] justify-center items-center inline-flex"
          }`}
          onClick={() => setIsReviewed("미완료")}
        >
          미완료
        </button>
        <button
          className={`${
            isReviewed === "완료"
              ? "w-[163px] h-[38px] p-2.5 rounded-[22px] justify-center items-center inline-flex bg-[#b0e484] text-white"
              : "bg-[#f3f3f3] text-gray-600 w-[163px] h-[38px] p-2.5 rounded-[22px] justify-center items-center inline-flex"
          }`}
          onClick={() => setIsReviewed("완료")}
        >
          완료
        </button>
      </div>

      {filteredAnswers?.map((question, index) => (
        <div
          key={index}
          className={`w-full h-[70px] mb-[10px] px-5 py-[18px] bg-[#fcfcfc] rounded-[10px] shadow justify-center items-center inline-flex ${
            question!.isReviewed ? "border border-primary-500" : ""
          }`}
        >
          <button
            onClick={() =>
              updateIsReviewed.mutate({
                answerId: question!.answerId,
                currentReviewed: question!.isReviewed
              })
            }
            className="w-full h-16 px-5 py-2.5 rounded-[10px] justify-between items-center inline-flex"
          >
            <h1 className="text-left text-black text-base font-bold font-['SUIT'] leading-normal">
              {question?.answer}
            </h1>
            <Image src={question!.isReviewed ? activeCheck : noActiveCheck} alt="status icon" className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default WordList;

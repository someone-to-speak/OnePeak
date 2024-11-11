"use client";

import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchUserWrongAnswers } from "@/api/wrongAnswersNote/fetchUserWrongAnswers";
import { fetchWordQuestions } from "@/api/wrongAnswersNote/fetchWordQuestions";
import Image from "next/image";
import noActiveCheck from "@/assets/noactive-check.svg";
import activeCheck from "@/assets/active-check.svg";
import { Typography } from "../ui/typography";

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

  if (userAnswersLoading || questionsLoading) return <p>로딩중입니다...</p>;
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
      <div className="bg-gray-900 flex my-4 rounded-[22px] w-[343px] h-[46px] p-2.5 justify-center items-center">
        <button
          className={`${
            isReviewed === "미완료"
              ? "w-[163px] h-[38px] rounded-[22px] justify-center items-center inline-flex bg-primary-700 text-primary-200"
              : "bg-gray-900 text-gray-600 w-[163px] h-[38px] rounded-[22px] justify-center items-center inline-flex"
          }`}
          onClick={() => setIsReviewed("미완료")}
        >
          <Typography size={16} weight="medium">
            미완료
          </Typography>
        </button>
        <button
          className={`${
            isReviewed === "완료"
              ? "w-[163px] h-[38px] rounded-[22px] justify-center items-center inline-flex bg-primary-700 text-primary-200"
              : "bg-gray-900 text-gray-600 w-[163px] h-[38px] rounded-[22px] justify-center items-center inline-flex"
          }`}
          onClick={() => setIsReviewed("완료")}
        >
          <Typography size={16} weight="medium">
            완료
          </Typography>
        </button>
      </div>

      {filteredAnswers?.map((question, index) => (
        <div
          key={index}
          className={`w-full h-auto mb-[10px] px-5 py-[18px] bg-white rounded-[10px] shadow-review ${
            question!.isReviewed ? "border border-primary-500" : ""
          }`}
        >
          <div className="flex items-start justify-between">
            <button onClick={() => {}} className="flex-1 flex gap-[30px]">
              <Typography
                size={14}
                weight="bold"
                className="w-[100px] text-left text-#000 break-words whitespace-pre-wrap"
              >
                {question?.content}
              </Typography>
              <Typography size={14} weight="medium" className="text-left text-#000 break-words">
                {question?.reason}
              </Typography>
            </button>
            <button
              onClick={() =>
                updateIsReviewed.mutate({
                  answerId: question!.answerId,
                  currentReviewed: question!.isReviewed
                })
              }
              className="flex-shrink-0 ml-4 w-6"
            >
              <div className="flex-none">
                <Image src={question!.isReviewed ? activeCheck : noActiveCheck} alt="status icon" className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WordList;

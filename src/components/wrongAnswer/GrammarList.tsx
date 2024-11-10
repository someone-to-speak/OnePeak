"use client";

import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchUserWrongAnswers } from "@/api/wrongAnswersNote/fetchUserWrongAnswers";
import { fetchGrammarQuestions } from "@/api/wrongAnswersNote/fetchGrammarQuestions";
import Image from "next/image";
import noActiveCheck from "@/assets/noactive-check.svg";
import activeCheck from "@/assets/active-check.svg";
import { Typography } from "../ui/typography";

const GrammarList = ({ userId }: { userId: string }) => {
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
    queryFn: () => fetchGrammarQuestions(),
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

  if (userAnswersLoading || questionsLoading) return <p>로딩중</p>;
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
          className={`w-full h-auto mb-[10px] px-5 py-[18px] justify-center bg-white rounded-[10px] shadow-review ${
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
            className="w-full flex flex-row items-center justify-between"
          >
            <div className="flex-none max-w-[60px]">
              <Typography size={16} weight="bold" className="text-left text-[#F50000] break-keep">
                {question?.answer}
              </Typography>
            </div>
            <div className="grow px-[20px]">
              <div className="flex flex-col gap-[10px]">
                <Typography size={16} weight="bold" className="text-left">
                  {question?.content}
                </Typography>
                <div className="border border-gray-900" />
                <Typography size={14} weight="medium" className="text-left text-gray-300">
                  {question?.reason}
                </Typography>
              </div>
            </div>
            <div className="flex-none">
              <Image src={question!.isReviewed ? activeCheck : noActiveCheck} alt="status icon" className="w-6 h-6" />
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default GrammarList;

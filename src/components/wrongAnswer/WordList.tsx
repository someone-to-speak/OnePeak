"use client";

import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchUserWrongAnswers } from "@/api/wrongAnswersNote/fetchUserWrongAnswers";
import { fetchWordQuestions } from "@/api/wrongAnswersNote/fetchWordQuestions";

const supabase = createClient();

const WordList = ({ userId }: { userId: string }) => {
  //   console.log("유저아이디", userId);

  const queryClient = useQueryClient();

  // 탭 상태 관리
  const [isReviewed, setIsReviewed] = useState<"미완료" | "완료">("미완료");

  // TanStack Query - 유저의 오답 데이터 가져오기
  const {
    data: userAnswers,
    error: userAnswersError,
    isLoading: userAnswersLoading
  } = useQuery({
    queryKey: ["userAnswers", userId],
    queryFn: () => fetchUserWrongAnswers(userId)
  });

  // TanStack Query로 단어문제 데이터 가져오기
  const {
    data: questions,
    error: questionsError,
    isLoading: questionsLoading
  } = useQuery({
    queryKey: ["questions"],
    queryFn: () => fetchWordQuestions()
  });

  //   console.log("userAnswers", userAnswers); // 오답
  //   console.log("questions", questions); // 단어문제

  // 'user_answer'테이블에서 is_reviewed를 업데이트하는 Mutation
  const updateIsReviewed = useMutation({
    mutationFn: async ({ answerId, currentReviewed }: { answerId: number; currentReviewed: boolean }) => {
      const { error } = await supabase
        .from("user_answer")
        .update({ is_reviewed: !currentReviewed }) // 기존 값 반대로 업데이트
        .eq("id", answerId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAnswers", userId] });
    }
  });

  // 로딩 상태
  if (userAnswersLoading || questionsLoading) return <p>Loading...</p>;
  // 오류 상태
  if (userAnswersError) return <p>Error loading user answers: {userAnswersError.message}</p>;
  if (questionsError) return <p>Error loading questions: {questionsError.message}</p>;

  // 변경된 부분: is_reviewed 상태에 따라 단어 오답만 필터링하는 로직 추가
  const wrongWordAnswers = userAnswers
    ?.filter((answer) => (isReviewed === "미완료" ? !answer.is_reviewed : answer.is_reviewed))
    .map((answer) => {
      const matchedQuestion = questions?.find((question) => question.id === answer.question_id);
      return matchedQuestion ? { ...matchedQuestion, answerId: answer.id, isReviewed: answer.is_reviewed } : null;
    })
    .filter((item) => item !== null);

  console.log("wrongWordAnswers", wrongWordAnswers);

  return (
    <div>
      {/* 탭 UI */}
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setIsReviewed("미완료")} className={isReviewed === "미완료" ? "font-bold" : ""}>
          미완료
        </button>
        <button onClick={() => setIsReviewed("완료")} className={isReviewed === "완료" ? "font-bold" : ""}>
          완료
        </button>
      </div>
      {/* '학습완료' 버튼클릭 시 각 탭에서의 효과 다르게 나타냄 */}
      {wrongWordAnswers?.map((question, index) => (
        <div key={index} className="flex gap-7">
          <h1>{question?.answer}</h1>
          <button
            onClick={() =>
              updateIsReviewed.mutate({
                answerId: question!.answerId, // 전달할 answerId
                currentReviewed: question!.isReviewed // 전달할 isReviewed 상태
              })
            }
            className={isReviewed === "미완료" ? "text-gray-400" : "text-black"} // '미완료'일 땐 회색, '완료'일 땐 검정색
          >
            학습완료
          </button>
        </div>
      ))}
    </div>
  );
};
export default WordList;

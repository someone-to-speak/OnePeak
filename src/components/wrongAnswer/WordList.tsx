"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { UUID } from "crypto";
import React from "react";

interface WordListProps {
  userId: string;
}

interface UserAnswer {
  id: UUID;
  user_id: UUID;
  question_id: number;
  selected_answer: string;
  is_corrected: boolean;
  is_reviewed: boolean;
  created_at: Date;
}
interface Questions {
  id: number;
  type: string;
  content: string;
  question_id: number;
  answer: string;
  language: string;
  reason: string;
  wrong_answer: string;
  created_at: Date;
}
const supabase = createClient();

// user_answer 데이터 가져오는 함수 정의
const fetchUserAnswers = async (): Promise<UserAnswer[]> => {
  const { data, error } = await supabase.from("user_answer").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// questions 데이터 가져오는 함수 정의
const fetchQuestions = async (): Promise<Questions[]> => {
  const { data, error } = await supabase.from("questions").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const WordList = ({ userId }: WordListProps) => {
  // TanStack Query로 사용자답변 데이터 가져오기
  const {
    data: userAnswers,
    error: userAnswersError,
    isLoading: userAnswersLoading
  } = useQuery({
    queryKey: ["userAnswers", userId],
    queryFn: () => fetchUserAnswers()
  });

  // TanStack Query로 문제 데이터 가져오기
  const {
    data: questions,
    error: questionsError,
    isLoading: questionsLoading
  } = useQuery({
    queryKey: ["questions"],
    queryFn: () => fetchQuestions()
  });

  console.log("userAnswers", userAnswers);
  console.log("questions", questions);

  // 로딩 상태
  if (userAnswersLoading || questionsLoading) return <p>Loading...</p>;
  // 오류 상태
  if (userAnswersError) return <p>Error loading user answers: {userAnswersError.message}</p>;
  if (questionsError) return <p>Error loading questions: {questionsError.message}</p>;

  const wrongWordAnswers = userAnswers
    ?.filter((answer) => !answer.is_corrected)
    .map((answer) => {
      const matchedWordQuestion = questions?.find(
        (question) => question.type === "word" && question.id === answer.question_id
      );
      return matchedWordQuestion ? matchedWordQuestion.answer : null;
    })
    .filter((answer) => answer !== null);

  console.log("wrongWordAnswers", wrongWordAnswers);

  return (
    <div>
      {wrongWordAnswers?.map((answer, index) => (
        <div key={index}>{answer}</div>
      ))}
    </div>
  );
};
export default WordList;

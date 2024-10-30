"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { UUID } from "crypto";
import React from "react";

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
  id: UUID;
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

const WrongWordPage = () => {
  // TanStack Query로 데이터 가져오기
  const {
    data: userAnswers,
    error: userAnswersError,
    isLoading: userAnswersLoading
  } = useQuery({
    queryKey: ["userAnswers"],
    queryFn: () => fetchUserAnswers()
  });

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

  return (
    <div>
      <h1>User Answers</h1>
      <div>
        {userAnswers &&
          userAnswers.map((answer) => (!answer.is_corrected ? <div key={answer.id}>{answer.question_id}</div> : null))}
      </div>
    </div>
  );
};
export default WrongWordPage;

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

// user_info 데이터 가져오는 함수 정의
const fetchUserInfo = async (userId: UUID) => {
  const { data, error } = await supabase.from("user_info").select("id").eq("id", userId).single(); // single()을 사용하여 단일 사용자 정보 가져오기

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

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
  const userId = "사용자의 UUID"; // 사용자의 UUID를 설정해야 합니다.

  // 사용자 정보를 가져오는 쿼리
  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userInfoLoading
  } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUserInfo(userId)
  });

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
  if (userInfoLoading || userAnswersLoading || questionsLoading) return <p>Loading...</p>;
  // 오류 상태
  if (userInfoError) return <p>Error loading user info: {userInfoError.message}</p>;
  if (userAnswersError) return <p>Error loading user answers: {userAnswersError.message}</p>;
  if (questionsError) return <p>Error loading questions: {questionsError.message}</p>;

  const wrongAnswers = userAnswers
    ?.filter((answer) => !answer.is_corrected)
    .map((answer) => {
      const matchedQuestion = questions?.find((question) => question.id === answer.question_id);
      return matchedQuestion ? matchedQuestion.answer : null;
    })
    .filter((answer) => answer !== null);

  console.log("wrongAnswers", wrongAnswers);

  return (
    <div>
      <h1>User Answers</h1>
      <div>
        {wrongAnswers?.map((answer, index) => (
          <div key={index}>{answer}</div>
        ))}
      </div>
    </div>
  );
};
export default WrongWordPage;

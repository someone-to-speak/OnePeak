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
const supabase = createClient();

// 데이터 가져오는 함수 정의
const fetchUserAnswers = async (): Promise<UserAnswer[]> => {
  const { data, error } = await supabase.from("user_answer").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const WrongWordPage = () => {
  // TanStack Query로 데이터 가져오기
  const {
    data: userAnswers,
    error,
    isLoading
  } = useQuery({
    queryKey: ["userAnswers"],
    queryFn: () => fetchUserAnswers()
  });

  console.log("userAnswers", userAnswers);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>User Answers</h1>
      {/* <div>
        {userAnswers &&
          userAnswers.map((answer) => <div key={answer.id}>(!answer.is_corrected?){answer.question_id}:null</div>)}
      </div> */}
      <div>
        {userAnswers &&
          userAnswers.map((answer) => (!answer.is_corrected ? <div key={answer.id}>{answer.question_id}</div> : null))}
      </div>
    </div>
  );
};
export default WrongWordPage;

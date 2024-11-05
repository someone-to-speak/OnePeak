"use client";

import RandomEnglishWordQuiz from "@/components/challenge/RandomEnglishWordQuiz";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const EnglishWordQuizPage = () => {
  return (
    <Suspense>
      <EnglishWordQuiz />
    </Suspense>
  );
};

const EnglishWordQuiz = () => {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId");

  return (
    <div>
      <h1>랜덤 영어 단어 퀴즈</h1>
      {userId && <RandomEnglishWordQuiz userId={userId} />}
    </div>
  );
};

export default EnglishWordQuizPage;

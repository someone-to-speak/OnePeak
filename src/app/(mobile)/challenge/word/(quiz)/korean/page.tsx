"use client";

import RandomKoreanWordQuiz from "@/components/challenge/RandomEnglishGrammarQuiz";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const KoreanWordQuizPage = () => {
  return (
    <Suspense>
      <KoreanWordQuiz />
    </Suspense>
  );
};

const KoreanWordQuiz = () => {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId");

  return (
    <div>
      <h1>랜덤 한글 단어 퀴즈</h1>
      {userId && <RandomKoreanWordQuiz userId={userId} />}
    </div>
  );
};

export default KoreanWordQuizPage;

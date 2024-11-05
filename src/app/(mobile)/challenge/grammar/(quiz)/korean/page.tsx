"use client";

import RandomKoreanGrammarQuiz from "@/components/challenge/RandomKoreanGrammarQuiz";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const KoreanGrammarQuizPage = () => {
  return (
    <Suspense>
      <KoreanGrammarQuiz />
    </Suspense>
  );
};

const KoreanGrammarQuiz = () => {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId");

  return (
    <div>
      <h1>랜덤 한글 문법 퀴즈</h1>
      {userId && <RandomKoreanGrammarQuiz userId={userId} />}
    </div>
  );
};

export default KoreanGrammarQuizPage;

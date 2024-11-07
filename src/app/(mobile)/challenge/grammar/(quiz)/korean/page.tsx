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

  return <div>{userId && <RandomKoreanGrammarQuiz userId={userId} />}</div>;
};

export default KoreanGrammarQuizPage;

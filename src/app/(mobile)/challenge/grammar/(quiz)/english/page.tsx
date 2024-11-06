"use client";

import RandomEnglishGrammarQuiz from "@/components/challenge/RandomKoreanWordQuiz";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const EnglishGrammarQuizPage = () => {
  return (
    <Suspense>
      <EnglishGrammarQuiz />
    </Suspense>
  );
};

const EnglishGrammarQuiz = () => {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId");

  return <div>{userId && <RandomEnglishGrammarQuiz userId={userId} />}</div>;
};

export default EnglishGrammarQuizPage;

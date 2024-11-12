"use client";

import RandomKoreanGrammarQuiz from "@/components/challenge/RandomKoreanGrammarQuiz";
import { useUser } from "@/hooks/useUser";
import { Suspense } from "react";

const KoreanGrammarQuizPage = () => {
  return (
    <Suspense>
      <KoreanGrammarQuiz />
    </Suspense>
  );
};

const KoreanGrammarQuiz = () => {
  const { userInfo } = useUser();
  const userId = userInfo?.id;

  return <div>{userId && <RandomKoreanGrammarQuiz userId={userId} />}</div>;
};

export default KoreanGrammarQuizPage;

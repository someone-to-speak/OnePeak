"use client";

import RandomEnglishGrammarQuiz from "@/components/challenge/RandomEnglishGrammarQuiz";
import { useUser } from "@/hooks/useUser";
import { Suspense } from "react";

const EnglishGrammarQuizPage = () => {
  return (
    <Suspense>
      <EnglishGrammarQuiz />
    </Suspense>
  );
};

const EnglishGrammarQuiz = () => {
  const { userInfo } = useUser();
  const userId = userInfo?.id;
  return <div>{userId && <RandomEnglishGrammarQuiz userId={userId} />}</div>;
};

export default EnglishGrammarQuizPage;

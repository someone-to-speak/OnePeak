"use client";

import RandomEnglishGrammarQuiz from "@/components/challenge/RandomEnglishGrammarQuiz";
import { useSearchParams } from "next/navigation";

const EnglishGrammarQuizPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId");

  return (
    <div>
      <h1>랜덤 영어 문법 퀴즈</h1>
      {userId && <RandomEnglishGrammarQuiz userId={userId} />}
    </div>
  );
};

export default EnglishGrammarQuizPage;

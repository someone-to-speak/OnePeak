"use client";

import RandomKoreanGrammarQuiz from "@/components/challenge/randomKoreanGrammarQuiz";
import { useSearchParams } from "next/navigation";

const KoreanGrammarQuizPage = () => {
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

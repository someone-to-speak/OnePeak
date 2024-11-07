"use client";

import RandomKoreanWordQuiz from "@/components/challenge/RandomKoreanWordQuiz";
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

  return <div>{userId && <RandomKoreanWordQuiz userId={userId} />}</div>;
};

export default KoreanWordQuizPage;

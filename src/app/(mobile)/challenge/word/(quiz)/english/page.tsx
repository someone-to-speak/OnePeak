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

  return <div>{userId && <RandomEnglishWordQuiz userId={userId} />}</div>;
};

export default EnglishWordQuizPage;

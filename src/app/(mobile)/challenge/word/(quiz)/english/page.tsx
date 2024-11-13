"use client";

import RandomEnglishWordQuiz from "@/components/challenge/RandomEnglishWordQuiz";
import { useUser } from "@/hooks/useUser";
import { Suspense } from "react";

const EnglishWordQuizPage = () => {
  return (
    <Suspense>
      <EnglishWordQuiz />
    </Suspense>
  );
};

const EnglishWordQuiz = () => {
  const { userInfo } = useUser();
  const userId = userInfo?.id;

  return <div>{userId && <RandomEnglishWordQuiz userId={userId} />}</div>;
};

export default EnglishWordQuizPage;

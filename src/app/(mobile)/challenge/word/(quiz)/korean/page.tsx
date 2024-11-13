"use client";

import RandomKoreanWordQuiz from "@/components/challenge/RandomKoreanWordQuiz";
import { useUser } from "@/hooks/useUser";
import { Suspense } from "react";

const KoreanWordQuizPage = () => {
  return (
    <Suspense>
      <KoreanWordQuiz />
    </Suspense>
  );
};

const KoreanWordQuiz = () => {
  const { userInfo } = useUser();
  const userId = userInfo?.id;

  return <div>{userId && <RandomKoreanWordQuiz userId={userId} />}</div>;
};

export default KoreanWordQuizPage;

"use client";

import RandomKoreanGrammarQuiz from "@/components/challenge/RandomKoreanGrammarQuiz";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { useUser } from "@/hooks/useUser";
import { useScreenSizeStore } from "@/shared/StoreProvider";
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
  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

  if (!userId) return null;

  return (
    <div className="flex flex-col gap-[70px]">
      {isLargeScreen && <WithIconHeader title="문법 챌린지" />}
      <RandomKoreanGrammarQuiz userId={userId} />
    </div>
  );
};

export default KoreanGrammarQuizPage;

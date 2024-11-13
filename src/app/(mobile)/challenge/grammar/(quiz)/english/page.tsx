"use client";

import RandomEnglishGrammarQuiz from "@/components/challenge/RandomEnglishGrammarQuiz";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { useUser } from "@/hooks/useUser";
import { useScreenSizeStore } from "@/shared/screen-store-provider";
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
  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

  if (!userId) return null;

  return (
    <div className="flex flex-col gap-[70px]">
      {isLargeScreen && <WithIconHeader title="문법 챌린지" />}
      <RandomEnglishGrammarQuiz userId={userId} />
    </div>
  );
};

export default EnglishGrammarQuizPage;

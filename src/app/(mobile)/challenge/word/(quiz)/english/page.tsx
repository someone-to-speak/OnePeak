"use client";

import RandomEnglishWordQuiz from "@/components/challenge/RandomEnglishWordQuiz";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { useUser } from "@/hooks/useUser";
import { useScreenSizeStore } from "@/shared/StoreProvider";
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
  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

  if (!userId) return null;

  return (
    <div className="flex flex-col gap-[70px]">
      {isLargeScreen && <WithIconHeader title="단어 챌린지" />}
      <RandomEnglishWordQuiz userId={userId} />
    </div>
  );
};

export default EnglishWordQuizPage;

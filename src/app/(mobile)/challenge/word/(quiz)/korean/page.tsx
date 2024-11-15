"use client";

import RandomKoreanWordQuiz from "@/components/challenge/RandomKoreanWordQuiz";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { useUser } from "@/hooks/useUser";
import { useScreenSizeStore } from "@/shared/screen-store-provider";
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
  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

  if (!userId) return null;

  return (
    <div className="flex flex-col gap-[70px]">
      {isLargeScreen && <WithIconHeader title="단어 챌린지" />}
      <RandomKoreanWordQuiz userId={userId} />
    </div>
  );
};

export default KoreanWordQuizPage;

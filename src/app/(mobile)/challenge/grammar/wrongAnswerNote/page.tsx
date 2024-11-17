"use client";

import GrammarList from "@/components/wrongAnswer/GrammarList";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

const WrongGrammarPage = async () => {
  // 특정 페이지로 이동하는 함수 정의
  const router = useRouter();
  const handleBackToChallenge = () => {
    router.push("/challenge"); // 특정 페이지로 이동
  };

  const { userInfo } = useUser();
  const userId = userInfo?.id;

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-3 md:gap-[70px]">
      <WithIconHeader title="문법 오답노트" onBack={handleBackToChallenge} />
      <GrammarList userId={userId} />
    </div>
  );
};

export default WrongGrammarPage;

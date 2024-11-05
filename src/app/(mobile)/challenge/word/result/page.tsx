"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ResultPage = () => {
  return (
    <Suspense>
      <Result />
    </Suspense>
  );
};

const Result = () => {
  const searchParams = useSearchParams();
  const message = searchParams?.get("message");

  return (
    <div>
      <h1>퀴즈 결과</h1>
      {message && <p>{message}</p>}
      <Link href="/challenge/word/wrongAnswerNote">오답노트로 가기</Link>
      <Link href="/challenge">챌린지로 돌아가기</Link>
    </div>
  );
};

export default ResultPage;

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ResultPage = () => {
  const searchParams = useSearchParams();
  const message = searchParams?.get("message");

  return (
    <div>
      <h1>퀴즈 결과</h1>
      {message && <p>{message}</p>}
<<<<<<< HEAD
      <Link href="/wrongAnswerNote">오답노트로 가기</Link>
=======
      <Link href="/challenge/word/wrongAnswerNote">오답노트로 가기</Link>
>>>>>>> ec04d5c1fde23089c34cd7010fe53531128202a0
      <Link href="/challenge">챌린지로 돌아가기</Link>
    </div>
  );
};

export default ResultPage;

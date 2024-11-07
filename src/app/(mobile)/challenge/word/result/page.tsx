"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import image0 from "@//assets/result/result-0.svg";
import image1 from "@//assets/result/result-1.svg";
import image2 from "@/assets/result/result-2.svg";
import image3 from "@/assets/result/result-3.svg";

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
  console.log(message);
  return (
    <div className="w-full flex flex-col relative min-h-screen gap-4">
      <div className="w-full flex flex-col justify-center min-h-[calc(100vh-150px)]">
        {message === "점수: 0 / 3" ? <Image src={image0} alt="Result 1" width={375} height={550} /> : null}
        {message === "점수: 1 / 3" ? <Image src={image1} alt="Result 1" width={375} height={550} /> : null}
        {message === "점수: 2 / 3" ? <Image src={image2} alt="Result 2" width={375} height={550} /> : null}
        {message === "점수: 3 / 3" ? <Image src={image3} alt="Result 3" width={375} height={550} /> : null}
      </div>
      <div className="w-full absolute bottom-[31px]">
        <div className="flex flex-col gap-[10px]">
          <Link
            href="/challenge/word/wrongAnswerNote"
            className="bg-primary-500 w-full h-[54px] p-2.5 rounded-[10px] justify-center items-center inline-flex text-center text-[#fcfcfc] text-lg font-bold font-['SUIT'] leading-[27px]"
            aria-label="오답노트로 가기"
          >
            오답노트로 가기
          </Link>

          <div>
            <Link
              href="/challenge"
              className="bg-[#fcfcfc] w-full h-[54px] p-2.5 rounded-[10px] border border-[#7bd232] justify-center items-center inline-flex text-center text-[#7bd232] text-lg font-bold font-['SUIT'] leading-[27px]"
              aria-label="챌린지로 돌아가기"
            >
              챌린지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;

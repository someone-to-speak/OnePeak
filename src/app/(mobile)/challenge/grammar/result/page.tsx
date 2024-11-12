"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import zeroPoint from "@//assets/result/zero-point.svg";
import onePoint from "@//assets/result/one-point.svg";
import twoPoint from "@/assets/result/two-point.svg";
import threePoint from "@/assets/result/three-point.svg";

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
        {message === "점수: 0 / 3" ? <Image src={zeroPoint} alt="zero" width={375} height={550} /> : null}
        {message === "점수: 1 / 3" ? <Image src={onePoint} alt="one" width={375} height={550} /> : null}
        {message === "점수: 2 / 3" ? <Image src={twoPoint} alt="two" width={375} height={550} /> : null}
        {message === "점수: 3 / 3" ? <Image src={threePoint} alt="three" width={375} height={550} /> : null}
      </div>
      <div className="w-full absolute bottom-[31px]">
        <div className="flex flex-col gap-[10px]">
          <Link
            href="/challenge/grammar/wrongAnswerNote"
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

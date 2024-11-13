"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import zeroPoint from "@//assets/result/zero-point.svg";
import onePoint from "@//assets/result/one-point.svg";
import twoPoint from "@/assets/result/two-point.svg";
import threePoint from "@/assets/result/three-point.svg";
import Button from "@/components/ui/button";
import { useScreenSizeStore } from "@/shared/screen-store-provider";
import NoIconHeader from "@/components/ui/NoIconHeader";

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
  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

  return (
    <>
      {isLargeScreen && <NoIconHeader title="챌린지 결과" />}
      <div className="w-full flex flex-col min-h-screen">
        <div className="mx-auto">
          {message === "점수: 0 / 3" ? <Image src={zeroPoint} alt="zero" width={375} height={550} /> : null}
          {message === "점수: 1 / 3" ? <Image src={onePoint} alt="one" width={375} height={550} /> : null}
          {message === "점수: 2 / 3" ? <Image src={twoPoint} alt="two" width={375} height={550} /> : null}
          {message === "점수: 3 / 3" ? <Image src={threePoint} alt="three" width={375} height={550} /> : null}
        </div>
        <div className="fixed left-0 right-0 bottom-[31px] px-[16px] md:static">
          <div className="flex flex-col gap-[10px] md:flex-row">
            <Link href="/challenge/word/wrongAnswerNote" className="w-[50%]">
              <Button text="오답노트로 가기" size="auto" />
            </Link>
            <Link href="/challenge" className="w-[50%]">
              <Button text="챌린지로 돌아가기" size="auto" variant="stroke" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultPage;

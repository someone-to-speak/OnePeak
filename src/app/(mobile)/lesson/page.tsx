"use client";

import React, { useEffect, useState } from "react";
import { useMatching } from "@/hooks/useMatching";
import Button from "@/components/ui/button/index";
import NoIconHeader from "@/components/ui/NoIconHeader";
import lessonCharactor from "@/assets/lesson/lesson-charactor.svg";
import spin25 from "@/assets/lesson/25%-spin.svg";
import spin50 from "@/assets/lesson/50%-spin.svg";
import spin75 from "@/assets/lesson/75%-spin.svg";
import spin100 from "@/assets/lesson/100%-spin.svg";
import Image from "next/image";
// import { Typography } from "./typography";

const LessonPage = () => {
  const { setupMatchingChannel, userInfo, isLoading, isMatching } = useMatching();
  const [matchingProgress, setMatchingProgress] = useState(0); // 로딩 진행 상태

  // 매칭 상태 업데이트 (예시로 로딩 상태에 따라 증가시키기)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null; // interval 타입 선언

    if (isMatching) {
      interval = setInterval(() => {
        setMatchingProgress((prev) => {
          if (prev >= 100) {
            if (interval) {
              clearInterval(interval); // 매칭 완료되면 인터벌 클리어
            }
            return 100;
          }
          return prev + 25; // 25%씩 증가
        });
      }, 1000); // 1초마다 진행 상황 증가
    }

    return () => {
      if (interval) {
        clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
      }
    };
  }, [isMatching]);

  const handleClickMachingButton = async () => {
    if (!userInfo) {
      alert("로그인 후 이용이 가능합니다.");
      return;
    }
    await setupMatchingChannel();
  };

  if (isLoading) return <div>로딩중입니다..</div>;

  return (
    <div className="bg-lessonBackground h-screen">
      <div className="bg-white px-4 flex">
        <NoIconHeader title="언어수업" />
      </div>
      {/* 기존 페이지 내용 */}
      <div className="relative">
        <div className="absolute top-0 left-0 z-[200] p-4 mt-6">
          <>
            <h1 className="text-black text-center font-suit text-[28px] font-bold leading-[42px] tracking-[-0.56px] self-stretch">
              1:1 랜덤 {userInfo?.learn_language}수업
            </h1>
            <p className="text-gray-400 font-pretendard text-[18px] font-medium leading-[27px] tracking-[-0.36px] self-stretch">
              학습언어 {userInfo?.learn_language}
            </p>
          </>
        </div>
        <Image src={lessonCharactor} alt="레슨페이지캐릭터" className="fixed bottom-[258px] left-1/4" />
        <div className="fixed bottom-[90px] w-full max-w-[343px] left-1/2 transform -translate-x-1/2 bg-white rounded-[20px] p-5 flex flex-col gap-4">
          {isMatching ? (
            <Button text="언어수업 취소하기" variant="stroke" />
          ) : (
            <Button text="시작하기" onClick={handleClickMachingButton} className="stroke" />
          )}
          <p className="text-gray-400 text-center font-pretendard text-[14px] font-medium leading-[21px] tracking-[-0.28px] px-4">
            1:1 랜덤 언어수업은 자동으로 녹음되어 채팅방에서 Ai가 분석한 결과를 알 수 있어요!
          </p>
          {/* 매칭 중일 때 오버레이와 로딩 스피너 버튼 표시 */}
          {isMatching && (
            <div className="fixed bottom-0 right-0">
              <button
                type="button"
                className="bg-white text-#000 py-2.5 px-5 flex items-center rounded-[25px] shadow-[2px_2px_8px_0px_rgba(0,0,0,0.22)]"
                disabled
              >
                {/* <Typography>매칭중</Typography> */}
                <span className="font-suit font-base font-bold leading-[21px]tracking-[-0.02em] mr-2.5">매칭중</span>
                {/* 진행 상태에 맞는 이미지 표시 */}
                {matchingProgress === 25 && (
                  <Image src={spin25} alt="25% 진행 중" width={28} height={28} className="w-8 h-8" />
                )}
                {matchingProgress === 50 && (
                  <Image src={spin50} alt="50% 진행 중" width={28} height={28} className="w-8 h-8" />
                )}
                {matchingProgress === 75 && (
                  <Image src={spin75} alt="75% 진행 중" width={28} height={28} className="w-8 h-8" />
                )}
                {matchingProgress === 100 && (
                  <Image src={spin100} alt="100% 진행 중" width={28} height={28} className="w-8 h-8" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;

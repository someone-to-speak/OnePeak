"use client";

import React from "react";
import { useMatching } from "@/hooks/useMatching";
import lessonBackground from "@/assets/iPhone-13-mini-124.svg";
import Image from "next/image";
import Button from "@/components/ui/button/index";

const LessonPage = () => {
  const { setupMatchingChannel, userInfo, isLoading, isMatching } = useMatching();

  const handleClickMachingButton = async () => {
    if (!userInfo) {
      alert("로그인 후 이용이 가능합니다.");
      return;
    }
    await setupMatchingChannel();
  };

  if (isLoading) return <div>로딩중입니다..</div>;

  return (
    <div className="h-screen">
      <div className="px-4 py-[10px] h-12 flex">
        <h1 className="text-gray-50 text-[18px] font-suit font-bold leading-[27px] tracking-[-0.36px] flex-1 justify-center">
          언어수업
        </h1>
      </div>
      {/* 기존 페이지 내용 */}
      <div className={isMatching ? "opacity-50 pointer-events-none relative" : "relative"}>
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
        <div className="fixed bottom-[90px] w-full max-w-[343px] left-1/2 transform -translate-x-1/2 bg-white rounded-[20px] p-5 flex flex-col gap-4">
          {/* <button
            onClick={handleClickMachingButton}
            className="bg-primary-500 text-white h-[54px] border border-none rounded-[10px] p-[10px]"
          >
            <p className="text-white text-center font-suit text-[18px] font-bold leading-[27px] tracking-[-0.36px]">
              시작하기
            </p>
          </button> */}
          <Button text="시작하기" onClick={handleClickMachingButton} />
          <p className="text-gray-400 text-center font-pretendard text-[14px] font-medium leading-[21px] tracking-[-0.28px] px-4">
            1:1 랜덤 언어수업은 자동으로 녹음되어 채팅방에서 Ai가 분석한 결과를 알 수 있어요!
          </p>
        </div>
        <Image src={lessonBackground} alt={"레슨배경이미지"} width={375} height={812} className="z-[150]" />
      </div>
      {/* 매칭 중일 때 오버레이와 로딩 스피너 버튼 표시 */}
      {isMatching && (
        <div className="fixed bottom-[80px]">
          <button
            type="button"
            className="bg-indigo-500 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            disabled
          >
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Processing...
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonPage;

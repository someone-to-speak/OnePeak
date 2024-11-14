"use client";

import React from "react";
import { useMatching } from "@/hooks/useMatching";
import Button from "@/components/ui/button/index";
import NoIconHeader from "@/components/ui/NoIconHeader";
import lessonCharactor from "@/assets/lesson/lesson-charactor.svg";
import Image from "next/image";
import SpinnerButton from "@/components/ui/SpinnerButton";
import { Typography } from "@/components/ui/typography";

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
    <div className="h-screen bg-lessonBackground md:bg-none">
      <div className="relative bg-white px-4 flex ">
        <NoIconHeader title="언어수업" />
      </div>
      <div className=" hidden md:h-[70px] md:flex md:justify-center md:items-center">
        {isMatching && <SpinnerButton />}
      </div>
      {/* 기존 페이지 내용 */}
      <div className="md:bg-tabletsLessonBackground md:h-[737px]">
        <div className="flex flex-col px-4 mt-6 mb-[161px] md:hidden">
          <Typography size={28} weight={"bold"} className="text-black leading-[42px] self-stretch">
            1:1 랜덤 {userInfo?.learn_language}수업
          </Typography>
          <Typography size={18} weight={"medium"} className="text-gray-400 leading-[27px] self-stretch">
            학습언어 {userInfo?.learn_language}
          </Typography>
        </div>
        <div className="absolute bottom-[90px] left-1/2 transform -translate-x-1/2 md:-translate-x-1/6 md:bottom-[33px] flex flex-col justify-center items-center md:pt-[235px]">
          <div className="mb-4 h-[208px] w-[188px] md:h-[265.53px] md:w-[240px] md:mb-[39.47px]">
            <Image
              src={lessonCharactor}
              alt="레슨페이지캐릭터"
              width={188}
              height={208}
              layout="responsive"
              className="block md:h-[265.53px] md:w-[240px]"
            />
          </div>
          <div className=" w-full max-w-[343px] md:max-w-[390px] bg-white rounded-[20px] p-5 flex flex-col gap-4">
            {isMatching ? (
              <Button text="언어수업 취소하기" variant="stroke" className="md:w-[350px]" />
            ) : (
              <Button text="시작하기" onClick={handleClickMachingButton} />
            )}
            <p className="text-gray-400 text-center font-pretendard text-[14px] md:text-[18px] font-medium leading-[21px] tracking-[-0.28px] px-4">
              1:1 랜덤 언어수업은 자동으로 녹음되어 채팅방에서 Ai가 분석한 결과를 알 수 있어요!
            </p>
          </div>
          <div className="absolute bottom-0 right-0 md:hidden">{isMatching && <SpinnerButton />}</div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;

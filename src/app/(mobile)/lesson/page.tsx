"use client";

import React from "react";
import Button from "@/components/ui/button/index";
import NoIconHeader from "@/components/ui/NoIconHeader";
import lessonCharactor from "@/assets/lesson/lesson-charactor.svg";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";
import { useUser } from "@/hooks/useUser";
import { useMatchingStore } from "@/shared/StoreProvider";

const LessonPage = () => {
  const { userInfo, isLoading } = useUser();
  const { isMatching, setIsMatching } = useMatchingStore((state) => state);

  const handleClickMachingButton = async () => {
    if (isMatching) {
      setIsMatching(false);
    } else {
      setIsMatching(true);
    }
  };

  if (isLoading) return <div>로딩중입니다...</div>;

  return (
    <div className="flex flex-col md:gap-[70px] w-full">
      <div className="bg-white px-4">
        <NoIconHeader title="언어수업" />
      </div>
      {/* 기존 페이지 내용 */}
      <div className="bg-white h-full">
        <div className="h-[640px] md:bg-tabletsLessonBackground bg-lessonBackground md:h-[737px] md:mb-0 mb-[80px]">
          <div className="flex flex-col px-4 pt-[24px] mb-[161px] md:hidden">
            <Typography size={28} weight={"bold"} className="text-black leading-[42px] self-stretch">
              1:1 랜덤 {userInfo?.learn_language}수업
            </Typography>
            <Typography size={18} weight={"medium"} className="text-gray-400 leading-[27px] self-stretch">
              학습언어 {userInfo?.learn_language}
            </Typography>
          </div>
          <div className="flex flex-col justify-center items-center md:pt-[235px] mb-[10px] mx-auto w-full">
            <div>
              <div className="mx-auto mb-4 h-[208px] w-[188px] md:h-[265.53px] md:w-[240px] md:mb-[39.47px]">
                <Image src={lessonCharactor} alt="레슨페이지캐릭터" width={188} height={208} layout="responsive" />
              </div>
              <div className="flex items-center justify-center mx-auto mb-[10px]">
                <div className="w-[343px] md:max-w-[390px] bg-white rounded-[20px] p-5 flex flex-col gap-4">
                  {isMatching ? (
                    <Button text="언어수업 취소하기" variant="stroke" onClick={handleClickMachingButton} />
                  ) : (
                    <Button text="시작하기" onClick={handleClickMachingButton} />
                  )}
                  <Typography size={14} weight="medium" className="text-gray-400 text-center">
                    1:1 랜덤 언어수업은 자동으로 녹음되어 채팅방에서 <br /> AI가 분석한 결과를 알 수 있어요!
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;

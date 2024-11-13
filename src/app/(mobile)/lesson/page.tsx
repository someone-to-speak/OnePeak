"use client";

import React from "react";
import { useMatching } from "@/hooks/useMatching";
import Button from "@/components/ui/button/index";
import NoIconHeader from "@/components/ui/NoIconHeader";
import lessonCharactor from "@/assets/lesson/lesson-charactor.svg";
import Image from "next/image";
// import { Typography } from "./typography";

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
      <div className="bg-white px-4 flex md:mb-[70px]">
        <NoIconHeader title="언어수업" />
      </div>
      {/* 기존 페이지 내용 */}
      <div className="relative md:bg-tabletsLessonBackground md:h-[737px]">
        <div className="absolute top-0 left-0 z-[200] p-4 mt-6 md:hidden">
          <h1 className="text-black text-center font-suit text-[28px] font-bold leading-[42px] tracking-[-0.56px] self-stretch ">
            1:1 랜덤 {userInfo?.learn_language}수업
          </h1>
          <p className="text-gray-400 font-pretendard text-[18px] font-medium leading-[27px] tracking-[-0.36px] self-stretch ">
            학습언어 {userInfo?.learn_language}
          </p>
        </div>
        <div className="fixed bottom-[258px] mb-4 left-1/2 -translate-x-1/2 h-[208px] w-[188px] md:h-[265.53px] md:w-[240px] md:mb-[39.47px]">
          <Image
            src={lessonCharactor}
            alt="레슨페이지캐릭터"
            width={188}
            height={208}
            layout="responsive"
            className="block md:h-[265.53px] md:w-[240px]"
          />
        </div>
        <div className="fixed bottom-[90px] md:bottom-[103px] w-full max-w-[343px] md:max-w-[390px] left-1/2 transform -translate-x-1/2 bg-white rounded-[20px] p-5 flex flex-col gap-4">
          {isMatching ? (
            <Button text="언어수업 취소하기" variant="stroke" className="md:w-[350px]" />
          ) : (
            <Button text="시작하기" onClick={handleClickMachingButton} />
          )}
          <p className="text-gray-400 text-center font-pretendard text-[14px] md:text-[18px] font-medium leading-[21px] tracking-[-0.28px] px-4">
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
                <span className="font-suit font-base font-bold leading-[21px] tracking-[-0.02em] mr-2.5">매칭중</span>

                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* 고정된 배경 원 */}
                  <circle
                    className="text-gray-200"
                    cx="12"
                    cy="12"
                    r="10" // 원의 중심 위치와 반지름을 설정
                    stroke="currentColor" // 원의 테두리 색상을 설정
                    strokeWidth="4" // 테두리 두께를 설정
                    fill="none" // 내부 채우기를 제거
                  />
                  {/* 반복해서 채워지고 비워지는 애니메이션 원 */}
                  <circle
                    cx="12"
                    cy="12"
                    r="10" // 중심 좌표와 반지름을 배경 원과 동일하게 설정
                    stroke="currentColor" // 현재 색상으로 테두리 색 설정
                    strokeWidth="4" // 테두리 두께 설정
                    fill="none" // 내부 채우기 없음
                    strokeDasharray="62.8" // 원 둘레 길이 (2 * π * 반지름) 설정
                    strokeDashoffset="62.8" // 원이 비어 있는 상태로 시작 (채워지는 시작점 설정)
                    className="animate-fill-empty" // 커스텀 애니메이션 클래스 적용
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;

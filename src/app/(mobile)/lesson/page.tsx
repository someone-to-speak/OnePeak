"use client";

import React from "react";
import { useMatching } from "@/hooks/useMatching";

import img1 from "@/../public/images/book.jpg";
import Image from "next/image";

const LessonPage = () => {
  const { setupMatchingChannel, userInfo, isMatching } = useMatching();

  const handleClickMachingButton = async () => {
    if (!userInfo) {
      alert("로그인 후 이용이 가능합니다.");
      return;
    }
    await setupMatchingChannel();
  };

  return (
    <>
      {/* 매칭 중일 때 오버레이와 로딩 스피너 버튼 표시 */}
      {isMatching && (
        <div className=" bg-black bg-opacity-50 flex items-center justify-center">
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

      {/* 기존 페이지 내용 */}
      <div className={isMatching ? "opacity-50 pointer-events-none" : ""}>
        <h1>언어수업</h1>
        <button onClick={handleClickMachingButton}>매칭하기</button>
        <Image src={img1} alt={"Image1"} />
        <p>학습언어 : {userInfo?.learn_language}</p>
      </div>
    </>
  );
};

export default LessonPage;

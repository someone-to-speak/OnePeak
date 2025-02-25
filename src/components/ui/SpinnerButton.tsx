// 언어수업 매칭 시에 나타나는 스피너버튼 UI 컴포넌트입니다.

import React from "react";
import { Typography } from "./typography";

const SpinnerButton = () => {
  return (
    <div>
      <button
        type="button"
        className="bg-white text-#000 py-[10px] px-5 flex items-center rounded-[25px] shadow-[2px_2px_8px_0px_rgba(0,0,0,0.22)]"
        disabled
      >
        <Typography size={14} weight="bold" className="mr-[10px] md:mr-4 md:text-lg">
          매칭중
        </Typography>

        <svg
          className="animate-spin h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 고정된 배경 원 */}
          <circle
            className="text-gray-200 stroke-primary-900 opacity-50"
            cx="14"
            cy="14"
            r="14" // 원의 중심 위치와 반지름을 설정
            // stroke="currentColor" // 원의 테두리 색상을 설정
            strokeWidth="4" // 테두리 두께를 설정
            fill="none" // 내부 채우기를 제거
          />
          {/* 반복해서 채워지고 비워지는 애니메이션 원 */}
          <circle
            cx="12"
            cy="12"
            r="10" // 중심 좌표와 반지름을 배경 원과 동일하게 설정
            // stroke="currentColor" // 현재 색상으로 테두리 색 설정
            strokeWidth="4" // 테두리 두께 설정
            fill="none" // 내부 채우기 없음
            strokeDasharray="31.4" /* 반 원 길이 (π * r) */
            strokeDashoffset="31.4"
            className="stroke-primary-500 animate-dash"
          />
        </svg>
      </button>
    </div>
  );
};

export default SpinnerButton;

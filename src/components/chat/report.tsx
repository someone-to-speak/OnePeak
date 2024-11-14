"use client";
import Image from "next/image";
import React, { useRef } from "react";
import reportIcon from "@/assets/report-icon.svg";
import cameraIcon from "@/assets/camera-icon.svg";

const Report = () => {
  // input 요소를 참조할 useRef
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // div 클릭 시 파일 입력 트리거
  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // 파일 선택 시 실행될 함수
  const handleImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e", e);
  };

  return (
    <div className="w-full px-[16px]  bg-[#FFF]  ">
      <div className=" flex gap-[6px] mb-[70px] md:mt-[70px]  ">
        <Image src={reportIcon} alt="신고하기 아이콘" className="md:hidden" />
        <h1
          className="text-[#0c0c0c] text-lg font-bold font-['SUIT']
       md:text-[#0c0c0c] md:text-4xl md:font-bold md:font-['SUIT'] "
        >
          신고하기
        </h1>
      </div>{" "}
      <div className="md:max-w-[454px] md:flex md:flex-col md:mx-auto">
        <h3 className="text-[#0c0c0c] mb-[6px] text-lg font-bold font-['SUIT']">사진첨부</h3>
        <div
          onClick={handleDivClick}
          className="w-[84px] mb-[28px] bg-[#E7F7D9] cursor-pointer p-[20.5px] flex flex-col items-center rounded-[10px]  md:w-[84px] md:mr-auto "
        >
          <Image src={cameraIcon} alt="카메라 아이콘" />
          <p className="text-[#7bd232]  text-[10px] font-medium font-['SUIT'] ">사진 등록</p>
        </div>
        <input type="file" onChange={handleImgFile} multiple className="hidden" ref={fileInputRef} />{" "}
        <h3 className="text-[#0c0c0c] mb-[6px] text-lg font-bold font-['SUIT']'] ">신고사유</h3>
        <textarea
          placeholder="사유를 작성해 주세요"
          className="w-full p-[20px] flex items-start border border-[#d9d9d9] rounded-[10px] bg-[#FDFDFD]   "
        ></textarea>
        <div className=" mt-[238px] flex gap-[10px] mb-[56px] ">
          <button className="w-full p-[10px]  rounded-[10px] bg-[#D9D9D9]  text-center text-[#fcfcfc] text-base font-medium font-['SUIT']   ">
            취소
          </button>
          <button className=" w-full p-[10px]  rounded-[10px] bg-[#F50000]  text-center text-[#fcfcfc] text-base font-medium font-['SUIT']   ">
            신고
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;

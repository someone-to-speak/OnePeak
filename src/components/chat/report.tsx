"use client";
import Image from "next/image";
import React from "react";
import reportIcon from "@/assets/report-icon.svg";
import cameraIcon from "@/assets/camera-icon.svg";

const Report = () => {
  const handleImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e", e);
  };

  return (
    <div className="w-full p-[30px] gap-[20px] flex flex-col  rounded-[16px] bg-[#fcfcfc] ">
      <div className="flex gap-[4px] justify-center items-center ">
        <Image src={reportIcon} alt="신고하기 아이콘" />
        <h1 className="text-black text-xl font-bold font-['SUIT']">신고하기</h1>
      </div>
      <div className="flex flex-col gap-[6px]">
        <h3 className="text-[#0c0c0c] text-sm font-bold font-['SUIT']">사진첨부</h3>
        <input type="file" onChange={handleImgFile} multiple />
      </div>
      <div className=" flex flex-col gap-[6px]">
        <h3 className="text-[#0c0c0c] text-sm font-bold font-['SUIT'] ">신고사유</h3>
        <textarea
          placeholder="사유를 작성해 주세요"
          className="p-[20px] flex items-start border border-[#d9d9d9] rounded-[10px] bg-[#FDFDFD]   "
        ></textarea>
      </div>
      <div className=" flex gap-[10px] ">
        <button className="w-full p-[10px]  rounded-[10px] bg-[#D9D9D9]  text-center text-[#fcfcfc] text-base font-medium font-['SUIT']   ">
          취소
        </button>
        <button className=" w-full p-[10px]  rounded-[10px] bg-[#F50000]  text-center text-[#fcfcfc] text-base font-medium font-['SUIT']   ">
          신고
        </button>
      </div>
    </div>
  );
};

export default Report;
// <div className="w-1/4 bg-[#E7F7D9] p-[20.5px] rounded-[10px] ">
//   <div className="flex flex-col gap-[5px] items-center justify-center ">
//     <Image className="" src={cameraIcon} alt="카메라 아이콘" />
//     <p className="text-[#7bd232] text-[10px] font-medium font-['SUIT'] ">사진 등록</p>
//   </div>
// </div>

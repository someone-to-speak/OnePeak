"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import reportIcon from "@/assets/report-icon.svg";
import cameraIcon from "@/assets/camera-icon.svg";
import { image } from "@nextui-org/theme";

const Report = () => {
  const [previewImgs, setPreviewImgs] = useState<string[]>([]);

  // useRef를 사용하여 div태그 클릭하면 input이 작동하게 함
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
    console.log(e.target.files);
    const imgLists = e.target.files;
    let imgUrlLists: string[] = [...previewImgs];
    // console.log(imgUrlLists);

    if (imgLists && imgLists.length > 0) {
      for (let i = 0; i < imgLists?.length; i++) {
        const currentImgUrl = URL.createObjectURL(imgLists[i]);
        imgUrlLists.push(currentImgUrl);
      }
    }

    setPreviewImgs(imgUrlLists);
    console.log(e.target.value);
  };

  // onChange를 통해서 함수가  돌아감  ->  같은 이미지 파일 연속으로 선택하면 변한게 없어서 onChange가 작동X -> onClick 할 때 마다 input에 있는 value값을 빈문자열로 초기화 해서 같은 파일 들어가더라도 변화를 만듬
  const resetInputValue = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.value = "";
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
          className="w-[84px] mb-[6px] bg-[#E7F7D9] cursor-pointer p-[20.5px] flex flex-col items-center rounded-[10px]  md:w-[84px] md:mr-auto "
        >
          <Image src={cameraIcon} alt="카메라 아이콘" />
          <p className="text-[#7bd232]  text-[10px] font-medium font-['SUIT'] ">사진 등록</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {previewImgs.map((imgUrl, index) => (
            <Image
              key={index}
              className="w-1/4 rounded-[10px]"
              src={imgUrl}
              alt="미리보기이미지"
              width={84}
              height={84}
            />
          ))}
        </div>
        <input
          type="file"
          onChange={handleImgFile}
          onClick={resetInputValue}
          multiple
          className="hidden"
          ref={fileInputRef}
        />{" "}
        <h3 className="text-[#0c0c0c] mt-[28px] mb-[6px] text-lg font-bold font-['SUIT']'] ">신고사유</h3>
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

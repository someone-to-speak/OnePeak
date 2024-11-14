"use client";
import { insertFaqData } from "@/api/route";
import { getUserClient } from "@/api/supabase/getUserClient";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";

const FaqPage = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [content, setContent] = useState<string>("");

  //유저정보 불러와서 차단당한 사람이면 alert useEffect로 띄운다.
  // useEffect 초기 렌더링 되자마자 실행되니까
  // csr컴포넌트면 클라이언트에서 가져와야함
  // 탠스택으로 유저정보 가져오고 alert만 userEffect
  // 탠스택 쓰려면 쿼리키 같아야함

  const { data, isPending, isError } = useQuery({
    queryKey: ["targetUserInfo"],
    queryFn: () => getUserClient()
  });

  useEffect(() => {
    if (data?.is_blocked) {
      alert("차단된 사용자입니다. 궁금한점이 있다면 1:1 문의를 남겨주세요");
    }
  });

  const faqDataHandler = async () => {
    if (!selectedType) {
      return alert("문의 유형을 선택해주세요");
    }
    if (!content) {
      return alert("사유를 작성해주세요");
    }

    const userId = data?.id;
    const userNickname = data?.nickname;
    const isSuccess = await insertFaqData(userId!, userNickname!, selectedType, content);
    if (isSuccess) {
      alert("문의가 성공하였습니다");
    } else {
      alert("문의하는데 실패하였습니다. 다시 시도해주세요");
    }
    setSelectedType("");
    setContent("");
  };

  if (isPending) {
    return (
      <div className="m-auto">
        <LoadingSpinner />;
      </div>
    );
  }
  if (isError) {
    return <div>사용자의 차단 여부를 확인하는데 실패하였습니다</div>;
  }

  return (
    <div className="w-full  p-[16px]">
      <h1
        className="mb-[52px] text-[#0c0c0c] text-lg font-bold font-['SUIT'] md:max-w-[1000px] md:mt-[70px]
       md:text-[#0c0c0c] md:text-4xl md:font-bold md:font-['SUIT']  "
      >
        1:1 문의하기
      </h1>
      <div className="md:max-w-[468px] md:flex md:flex-col md:mx-auto">
        <div className="flex flex-col gap-[28px] my-[20px] mb-[120px] md:w-full">
          <div>
            <h3 className="mb-[10px] text-[#0c0c0c] text-sm font-bold font-['SUIT'] ">카테고리</h3>
            <select
              value={selectedType}
              className=" mb-[30px] flex rounded-[10px] border border-[#7BD232] w-full  py-[12px] px-[20px]  "
              onChange={(e) => {
                setSelectedType(e.target.value);
              }}
            >
              <option value="" disabled>
                문의 유형 선택
              </option>
              <option value="inquiry">1:1 문의하기</option>
              <option value="unblockRequest">차단 해지 신청</option>
            </select>
          </div>
          <div>
            <h3 className=" mb-[6px] text-[#0c0c0c] text-sm font-bold font-['SUIT'] ">문의 내용</h3>
            <textarea
              className="mb-[20px] flex p-[20px] w-full items-start  rounded-[10px] border border-[#7BD232] placeholder:text-[#a5a5a5] placeholder:text-sm placeholder:font-medium placeholder:font-['Pretendard'] "
              placeholder="사유를 작성해 주세요"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            ></textarea>
          </div>
        </div>
        <div className="flex w-full items-start gap-[10px] mb-[62.74px] ">
          <button
            onClick={() => {
              window.history.back();
            }}
            className="p-[10px] w-full justify-center items-center  rounded-[10px] bg-[#d9d9d9] text-center text-[#fcfcfc] font-medium font-['Pretendard']  "
          >
            취소
          </button>
          <button
            className="w-full p-[10px] justify-center items-center  rounded-[10px] bg-[#7bd232] text-center text-[#fcfcfc] font-medium font-['Pretendard']  "
            onClick={faqDataHandler}
          >
            문의
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;

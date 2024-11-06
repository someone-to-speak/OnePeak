"use client";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import caretleft from "@/assets/caret-left.svg";

const IsMarketed = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isMarketed, setIsMarketed] = useState<boolean>(false);

  const handleAddMarketedInfo = async (isMarketed: boolean) => {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;

    if (userId) {
      const { error } = await supabase.from("user_info").update({ is_marketing: isMarketed }).eq("id", userId);

      if (!error) {
        alert("에러가 났습니다 다시 시도해주세요");
        router.push("/"); // 홈화면으로 이동
      }
    }
  };
  return (
    <div className="w-full">
      <button
        onClick={() => router.back()} // 뒤로 가기 함수 호출
        className="flex h-[48px] px-[16px] items-center gap-[6px] bg-white-fdfdfd "
      >
        <Image height={24} src={caretleft} alt={"caret-left"} className="bg-[#fcfcfc] " />
      </button>
      <div className="flex flex-col items-center gap-[4px] mt-[10px]">
        <h2 className="text-center text-black text-[28px] font-bold font-['SUIT']">마케팅 활용 광고 수신 동의</h2>

        <p className="text-center text-[#8c8c8c] text-sm font-medium font-['Pretendard'] ">
          서비스완 관련된 소식, 이벤트 안내, 고객 혜택 등 다양한 정보를 제공합니다.
        </p>
      </div>
      <button
        onClick={() => {
          setIsMarketed(false);
          handleAddMarketedInfo(isMarketed);
        }}
        className=" mt-[490px] text-center text-[#8c8c8c] text-xs font-bold font-['SUIT'] underline "
      >
        미동의하고 시작하기
      </button>

      <button
        onClick={() => {
          setIsMarketed(true);
          handleAddMarketedInfo(isMarketed);
        }}
      >
        동의하고 시작하기
      </button>
    </div>
  );
};

export default IsMarketed;

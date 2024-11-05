"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const IsMarketed = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isMarketed, setIsMarketed] = useState<boolean>(false);

  const handleMarketed = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;

    if (userId) {
      const { error } = await supabase.from("user_info").update({ is_marketing: isMarketed }).eq("id", userId);

      if (!error) {
        router.push("/"); // 홈화면으로 이동
      }
    }
  };
  return (
    <div className="w-[310px] h-[175px] inline-flex p-[30px] flex-col justify-center items-center gap-[20px] rounded-[16px] bg-[#FDFDFD] mx-auto">
      <div>
        <p className="text-black font-pretendard text-[18px] font-medium leading-[27px] tracking-[-0.36px]">
          각종 이벤트 소식 받으실래요?
        </p>
      </div>
      <div className="flex w-[250px] h-[46px] items-start gap-[10px]">
        <button
          onClick={() => {
            setIsMarketed(true);
          }}
          className="flex p-[10px] justify-center items-center gap-[8px] flex-1 self-stretch rounded-[10px] bg-[var(--Primary-500, #7BD232)]"
        >
          동의
        </button>
        <button
          onClick={() => {
            setIsMarketed(false);
          }}
          className="flex p-[10px] justify-center items-center gap-[8px] flex-1 self-stretch rounded-[10px] bg-[var(--Gray-800, #D9D9D9)]"
        >
          비동의
        </button>
      </div>
      <button
        onClick={handleMarketed}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        시작하기
      </button>
    </div>
  );
};

export default IsMarketed;

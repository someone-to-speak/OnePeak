"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SetNickname() {
  const [nickname, setNickname] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const maxTexts = 12; // 최대 글자 수 설정

  const handleContinue = async () => {
    if (nickname) {
      const { data } = await supabase.auth.getSession();
      const userId = data?.session?.user?.id;

      if (userId) {
        const { error } = await supabase.from("user_info").update({ nickname }).eq("id", userId);

        if (!error) {
          router.push("/loginInfo/setMyLanguage");
        }
      }
    }
  };

  return (
    <div className="p-4 gap-[10px]">
      <div className="h-12"></div>
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-[var(--Primary-50,#020401)] text-center font-suit text-[28px] font-bold leading-[42px] tracking-[-0.56px]">
          닉네임을 입력해 주세요
        </h1>
        <p className="text-[var(--Gray-500,#8C8C8C)] text-center font-pretendard text-[14px] font-medium leading-[21px] tracking-[-0.28px]">
          원픽에서 사용할 닉네임을 설정해 주세요
        </p>
      </div>
      <div className="flex flex-col gap-[6px] mb-[447px]">
        <p className="text-[var(--Gray-500,#8C8C8C)] text-right font-pretendard text-[12px] font-medium leading-[18px] tracking-[-0.24px]">
          {nickname.length}/{maxTexts}
        </p>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력해 주세요"
          className="flex h-[50px] px-[20px] py-[10px] items-center gap-[10px] self-stretch rounded-[12px] border border-[var(--Gray-600,#A6A6A6)] bg-[var(--White,#FDFDFD]"
          maxLength={maxTexts} // 최대 글자 수 제한
        />
      </div>
      <button
        onClick={handleContinue}
        disabled={!nickname}
        className={`flex w-full h-[54px] p-[10px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[10px] mb-[10px] ${
          nickname ? "opacity-100 bg-[var(--Primary-500,#7BD232)]" : "opacity-40 bg-[var(--Primary-500,#7BD232)]"
        }`}
      >
        계속
      </button>
    </div>
  );
}

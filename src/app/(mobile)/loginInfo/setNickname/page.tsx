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
    <div>
      <div className="flex flex-col items-center">
        <h1>닉네임을 입력해 주세요</h1>
        <p>원픽에서 사용할 닉네임을 설정해 주세요</p>
      </div>
      <div className="flex flex-col">
        <p className="flex justify-end">
          {nickname.length}/{maxTexts}
        </p>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력해 주세요"
          className="border rounded p-2"
          maxLength={maxTexts} // 최대 글자 수 제한
        />
      </div>
      <button
        onClick={handleContinue}
        disabled={!nickname}
        className={`w-full mt-4 p-2 rounded ${nickname ? "bg-green-500" : "bg-gray-300"}`}
      >
        계속
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const learnLanguages = ["영어", "일본어", "스페인어", "프랑스어"];

export default function SetLearnLanguage() {
  const [selectedLearnLanguage, setSelectedLearnLanguage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleContinue = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;

    console.log("User ID:", userId); // 유저 ID 확인
    console.log("learnLanguage to update:", selectedLearnLanguage); // 업데이트할 닉네임 확인

    if (userId && selectedLearnLanguage) {
      const { error } = await supabase
        .from("user_info")
        .update({ learn_language: selectedLearnLanguage })
        .eq("user_id", userId);

      if (!error) {
        router.push("/"); // 홈화면으로 이동
      }
    }
  };

  return (
    <div>
      <h1>너의 학습언어 알려줘</h1>
      <p>본인이 배우고 싶은 언어를 설정해주시면 됩니다.</p>
      <div className="flex flex-col justify-center items-center">
        {learnLanguages.map((language) => (
          <button
            key={language}
            onClick={() => setSelectedLearnLanguage(language)}
            className={`w-[50%] p-2 m-2 rounded ${selectedLearnLanguage === language ? "bg-green-500" : "bg-gray-300"}`}
          >
            {language}
          </button>
        ))}
      </div>
      <button
        onClick={handleContinue}
        disabled={!selectedLearnLanguage}
        className={`w-full mt-4 p-2 rounded ${selectedLearnLanguage ? "bg-green-500" : "bg-gray-300"}`}
      >
        계속
      </button>
    </div>
  );
}

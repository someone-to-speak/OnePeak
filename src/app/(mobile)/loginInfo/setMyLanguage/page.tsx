"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const languages = ["한국어", "일본어", "스페인어", "영어"];

export default function SetMyLanguage() {
  const [selectedMyLanguage, setSelectedMyLanguage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleContinue = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;

    console.log("User ID:", userId); // 유저 ID 확인
    console.log("mylanguage to update:", selectedMyLanguage); // 업데이트할 닉네임 확인

    if (userId && selectedMyLanguage) {
      const { error } = await supabase
        .from("user_info")
        .update({ my_language: selectedMyLanguage })
        .eq("user_id", userId);

      if (!error) {
        router.push("/loginInfo/setLearnLanguage");
      }
    }
  };

  return (
    <div>
      <h1>너의 모국어 알려줘</h1>
      <p>본인의 모국어를 설정해주시면 됩니다.</p>
      <div className="flex flex-col justify-center items-center">
        {languages.map((language) => (
          <button
            key={language}
            onClick={() => setSelectedMyLanguage(language)}
            className={`w-[50%] p-2 m-2 rounded ${selectedMyLanguage === language ? "bg-green-500" : "bg-gray-300"}`}
          >
            {language}
          </button>
        ))}
      </div>
      <button
        onClick={handleContinue}
        disabled={!selectedMyLanguage}
        className={`w-full mt-4 p-2 rounded ${selectedMyLanguage ? "bg-green-500" : "bg-gray-300"}`}
      >
        계속
      </button>
    </div>
  );
}

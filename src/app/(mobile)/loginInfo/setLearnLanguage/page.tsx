"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { fetchLanguageName } from "@/api/firstSetting/fetchLanguageName";

const learnLanguages = ["영어", "일본어", "스페인어", "프랑스어"];

export default function SetLearnLanguage() {
  const [selectedLearnLanguage, setSelectedLearnLanguage] = useState<string>("");
  const router = useRouter();
  const supabase = createClient();

  // Tanstack Query - 지원언어 데이터 가져오기
  const {
    data: languages,
    error: languagesError,
    isLoading: languagesLoading
  } = useQuery({
    queryKey: ["language"],
    queryFn: () => fetchLanguageName()
  });

  // 로딩 상태
  if (languagesLoading) return <p>Loading...</p>;
  // 오류 상태
  if (languagesError) return <p>Error loading user answers: {languagesError.message}</p>;

  const handleContinue = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;

    console.log("User ID:", userId); // 유저 ID 확인
    console.log("learnLanguage to update:", selectedLearnLanguage); // 업데이트할 닉네임 확인

    if (userId && selectedLearnLanguage) {
      const { error } = await supabase
        .from("user_info")
        .update({ learn_language: selectedLearnLanguage })
        .eq("id", userId);

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
        {languages?.map((language, index) => (
          <button
            key={index}
            onClick={() => setSelectedLearnLanguage(language.language_name)}
            className={`w-[50%] p-2 m-2 rounded ${
              selectedLearnLanguage === language.language_name ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            {language.language_name}
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

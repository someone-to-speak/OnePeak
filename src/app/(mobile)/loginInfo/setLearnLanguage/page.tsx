"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { fetchLanguageName } from "@/api/firstSetting/fetchLanguageName";

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

  const supportingLanguages = languages?.map((language) => language.language_name);

  // 로딩 상태
  if (languagesLoading) return <p>Loading...</p>;
  // 오류 상태
  if (languagesError) return <p>Error loading user answers: {languagesError.message}</p>;

  const handleContinue = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;

    if (userId && selectedLearnLanguage) {
      const { error } = await supabase
        .from("user_info")
        .update({ learn_language: selectedLearnLanguage })
        .eq("id", userId);

      if (!error) {
        router.push("/loginInfo/setIsMarketed");
      }
    }
  };

  return (
    <div>
      <button
        onClick={() => router.back()} // 뒤로 가기 함수 호출
        className="mb-4 font-bold"
      >
        ←
      </button>
      <div className="flex flex-col items-center">
        <h1>학습언어를 선택해 주세요</h1>
        <p>배우고 싶은 언어를 설정해 주세요</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        {supportingLanguages?.map((language, index) => (
          <button
            key={index}
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

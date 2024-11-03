"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { fetchLanguageName } from "@/api/firstSetting/fetchLanguageName";

export default function SetMyLanguage() {
  const [selectedMyLanguage, setSelectedMyLanguage] = useState<string>("");
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

    if (userId && selectedMyLanguage) {
      const { error } = await supabase.from("user_info").update({ my_language: selectedMyLanguage }).eq("id", userId);

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
        {supportingLanguages?.map((language, index) => (
          <button
            key={index}
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

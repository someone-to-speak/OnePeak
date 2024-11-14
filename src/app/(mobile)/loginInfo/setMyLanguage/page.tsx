"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { fetchLanguageName } from "@/api/firstSetting/fetchLanguageName";
import caretleft from "@/assets/caret-left.svg";
import check from "@/assets/check.svg";
import Image from "next/image";

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
    <div className="md:max-w-[480px] md:mx-auto">
      <button
        onClick={() => router.back()} // 뒤로 가기 함수 호출
        className="mb-4 md:hidden"
      >
        <Image src={caretleft} alt={"caret-left"} />
      </button>

      <div className="md:py-[40px] md:mt-[70px]">
        <div className="mb-6 flex flex-col items-center gap-1 ">
          <h1 className="text-primary-50 text-center font-suit text-[28px] font-bold leading-[42px] tracking-[-0.56px]">
            모국어를 선택해 주세요
          </h1>
          <p className="text-gray-500 text-center font-pretendard text-[14px] font-medium leading-[21px] tracking-[-0.28px]">
            모국어를 설정해 주세요
          </p>
        </div>
        <div className="w-full flex flex-col items-start gap-2 shrink-0 md:flex md:flex-wrap md:flex-row md:mx-auto md:mb-[70px]">
          {supportingLanguages?.map((language, index) => (
            <button
              key={index}
              onClick={() => setSelectedMyLanguage(language)}
              className={`flex items-center justify-between h-[64px] py-[10px] px-[20px] rounded-[10px] text-left gap-[10px] self-stretch shrink-0
                ${
                  selectedMyLanguage === language
                    ? "border border-secondary-500 bg-secondary-900"
                    : "border border-gray-800 bg-white"
                } md:w-[112px] `}
            >
              <p className="flex-grow">{language}</p>
              {selectedMyLanguage === language && <Image src={check} alt="checkIcon" className="w-6 h-6" />}
            </button>
          ))}
        </div>
      </div>
      <div className="relative z-0 bg-white py-[10px]">
        <button
          onClick={handleContinue}
          disabled={!selectedMyLanguage}
          className={`flex w-full h-[54px] p-[10px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[10px] mb-[10px] ${
            selectedMyLanguage ? "opacity-100 bg-primary-500" : "opacity-40 bg-primary-500 md:max-w-[343px] md:mx-auto"
          } md:my-[70px] `}
        >
          계속
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { fetchLanguageName } from "@/api/firstSetting/fetchLanguageName";
import caretleft from "@/assets/caret-left.svg";
import check from "@/assets/check.svg";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { fetchMyLanguage } from "@/api/firstSetting/fetchMyLanguage";
import { useUser } from "@/hooks/useUser";

export default function SetLearnLanguage() {
  const [selectedLearnLanguage, setSelectedLearnLanguage] = useState<string>("");
  const { userInfo } = useUser();
  const router = useRouter();
  const supabase = createClient();

  // TanStack Query - 사용자가 선택한 my_language 가져오기
  const {
    data: selectedMyLanguage,
    error: selectedMyLanguageError,
    isLoading: selectedMyLanguageLoading
  } = useQuery({
    queryKey: ["selectedMyLanguage", userInfo?.id],
    queryFn: () => fetchMyLanguage(userInfo?.id as string)
  });

  // Tanstack Query - 지원언어 데이터 가져오기
  const {
    data: languages,
    error: languagesError,
    isLoading: languagesLoading
  } = useQuery({
    queryKey: ["language"],
    queryFn: () => fetchLanguageName()
  });

  // 지원 언어에서 사용자가 이미 선택한 모국어 제외
  const supportingLanguages = languages
    ?.map((language) => language.language_name)
    .filter((language) => language !== selectedMyLanguage?.my_language);

  // 로딩 상태
  if (languagesLoading || selectedMyLanguageLoading) return <LoadingSpinner />;
  // 오류 상태
  if (languagesError) return console.error(`${languagesError.message}`);
  if (selectedMyLanguageError) return console.error(`${selectedMyLanguageError.message}`);

  // 학습언어 선택 후 다음 페이지로 이동하는 함수
  const handleContinue = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;

    // 학습 언어를 사용자 정보에 업데이트
    if (userId && selectedLearnLanguage) {
      const { error } = await supabase
        .from("user_info")
        .update({ learn_language: selectedLearnLanguage })
        .eq("id", userId);

      // 성공적으로 업데이트된 경우 다음 페이지로 이동
      if (!error) {
        router.push("/loginInfo/marketingConsent");
      }
    }
  };

  return (
    <div className="md:mt-[70px] md:max-w-[480px] md:mx-auto">
      <button onClick={() => router.back()} className="mb-[10px] md:hidden py-[12px]">
        <Image src={caretleft} alt={"caret-left"} />
      </button>
      <div className="md:py-[40px] md:mt-[70px]">
        <div className="mb-6 flex flex-col items-center gap-1">
          <Typography size={28} weight="bold" className="text-primary-50 text-center">
            학습언어를 선택해 주세요
          </Typography>
          <Typography size={14} weight="medium" className="text-gray-500 text-center">
            배우고 싶은 언어를 설정해 주세요
          </Typography>
        </div>
        <div className="rounded flex flex-wrap justify-center gap-2">
          {supportingLanguages?.map((language, index) => (
            <button
              key={index}
              onClick={() => setSelectedLearnLanguage(language)}
              className={`w-full h-[64px] md:h-[48px] px-5 bg-white rounded-[10px] border border-gray-800 flex justify-center items-center gap-2.5 hover:bg-secondary-900 hover:text-secondary-500
              ${
                selectedLearnLanguage === language
                  ? "border border-secondary-500 bg-secondary-900"
                  : "border border-gray-800 bg-white"
              } md:px-[15px] md:w-auto`}
            >
              <Typography size={16} weight="bold" className="flex-grow text-wrap">
                {language}
              </Typography>
              {selectedLearnLanguage === language && <Image src={check} alt="checkIcon" className="w-6 h-6" />}
            </button>
          ))}
        </div>
      </div>
      <div className="relative z-0 bg-white py-[10px] md:max-w-[323px] md:mx-auto">
        <button
          onClick={handleContinue}
          disabled={!selectedLearnLanguage}
          className={`flex w-full h-[54px] p-[10px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[10px] mb-[10px] ${
            selectedLearnLanguage ? "opacity-100 bg-primary-500" : "opacity-40 bg-primary-500"
          } md:my-[70px]`}
        >
          계속
        </button>
      </div>
    </div>
  );
}

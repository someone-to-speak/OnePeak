"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/utils/myPage/logout";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateLearnLanguage, updateMyLanguage } from "@/utils/myPage/updateLanguage";
import ImageSelectorDropDown from "@/components/myPage/LanguageSelectorDropDown";
import Image from "next/image";

type LanguageType = {
  id: number;
  language_name: string;
  language_img_url: string;
};

const supabase = createClient();

const SettingsPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedMyLanguage, setSelectedMyLanguage] = useState<string>("");
  const [selectedLearnLanguage, setSelectedLearnLanguage] = useState<string>("");
  const [languageOptions, setLanguageOptions] = useState<LanguageType[]>([]);
  const [currentMyLanguage, setCurrentMyLanguage] = useState<string>("");
  const [currentLearnLanguage, setCurrentLearnLanguage] = useState<string>("");
  const [learnLanguageUrl, setLearnLanguageUrl] = useState<string>("");
  const [myLanguageUrl, setMyLanguageUrl] = useState<string>("");

  console.log("learnLanguageUrl:", learnLanguageUrl);
  console.log("myLanguageUrl:", myLanguageUrl);
  console.log("languageOptions:", languageOptions);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id);
        const { data: languages, error: langError } = await supabase
          .from("user_info")
          .select(
            "my_language, learn_language, learn_language:language!user_info_learn_language_fkey(language_img_url, language_name), my_language:language!user_info_my_language_fkey(language_img_url, language_name)"
          )
          .eq("id", data.session.user.id)
          .single();

        if (langError) throw langError;

        if (languages) {
          setCurrentMyLanguage(languages.my_language?.language_name || "");
          setCurrentLearnLanguage(languages.learn_language?.language_name || "");
          if (languages.my_language) {
            setMyLanguageUrl(languages.my_language.language_img_url);
          }
          if (languages.learn_language) {
            setLearnLanguageUrl(languages.learn_language.language_img_url);
          }
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchLanguages = async () => {
      const { data, error } = await supabase.from("language").select("*");
      if (error) throw error;
      setLanguageOptions(data);
    };

    fetchLanguages();
  }, []);

  const handleUpdateMyLanguage = async () => {
    if (!userId || !selectedMyLanguage) return;

    try {
      await updateMyLanguage(userId, selectedMyLanguage);
      setCurrentMyLanguage(
        languageOptions.find((lang) => lang.language_name === selectedMyLanguage)?.language_name || ""
      );
      setMyLanguageUrl(
        languageOptions.find((lang) => lang.language_name === selectedMyLanguage)?.language_img_url || ""
      );
    } catch {
      alert("언어 설정 저장 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateLearnLanguage = async () => {
    if (!userId || !selectedLearnLanguage) return;

    try {
      await updateLearnLanguage(userId, selectedLearnLanguage);
      setCurrentLearnLanguage(
        languageOptions.find((lang) => lang.language_name === selectedLearnLanguage)?.language_name || ""
      );
      setLearnLanguageUrl(
        languageOptions.find((lang) => lang.language_name === selectedLearnLanguage)?.language_img_url || ""
      );
    } catch {
      alert("언어 설정 저장 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      console.log("User logged out.");
      router.push("/");
    } catch {
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  }, [router]);

  const cancelAccount = async () => {
    const confirmation = confirm("정말 회원 계정을 탈퇴하시겠습니까?");
    if (!confirmation || !userId) return;

    try {
      const { error } = await supabase.from("user_info").update({ is_deleted: true }).eq("id", userId);
      if (error) throw error;
      alert("회원 계정이 성공적으로 탈퇴되었습니다.");
      handleLogout();
    } catch {
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <h3>내 언어</h3>
        {currentMyLanguage}
        {myLanguageUrl && <Image src={myLanguageUrl} alt="내 언어 이미지" width={32} height={32} className="rounded" />}
        <div className="flex flex-row w-[50%]">
          <ImageSelectorDropDown
            selectedLanguage={selectedMyLanguage}
            languageOptions={languageOptions}
            onLanguageChange={(language) => {
              setSelectedMyLanguage(language);
            }}
          />
          <button onClick={handleUpdateMyLanguage} className="hover:bg-blue-600 p-2">
            수정하기
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <h3>배우고 싶은 언어</h3>
        {currentLearnLanguage}
        {learnLanguageUrl && (
          <Image src={learnLanguageUrl} alt="배우고 싶은 언어 이미지" width={32} height={32} className="rounded" />
        )}
        <div className="flex flex-row w-[50%]">
          <ImageSelectorDropDown
            selectedLanguage={selectedLearnLanguage}
            languageOptions={languageOptions}
            onLanguageChange={(language) => {
              setSelectedLearnLanguage(language);
            }}
          />
          <button onClick={handleUpdateLearnLanguage} className="hover:bg-blue-600 p-2">
            수정하기
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <h3>알림 설정</h3>
      </div>
      <div className="w-full">
        <div className="flex flex-row items-center">
          <button onClick={handleLogout} className="w-[50%] hover:bg-red-600 p-4">
            로그아웃
          </button>
          <button onClick={cancelAccount} className="w-[50%] hover:bg-red-600 p-4">
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

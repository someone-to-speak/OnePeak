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
  const [currentMyLanguage, setCurrentMyLanguage] = useState<string | null>(null);
  const [currentLearnLanguage, setCurrentLearnLanguage] = useState<string | null>(null);
  const [learnLanguageUrl, setLearnLanguageUrl] = useState<string | null>(null);
  const [myLanguageUrl, setMyLanguageUrl] = useState<string | null>(null);

  console.log("learnLanguageUrl:", learnLanguageUrl);
  console.log("myLanguageUrl:", myLanguageUrl);
  console.log("languageOptions:", languageOptions);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (data.user) {
          setUserId(data.user.id);
          console.log("User ID:", data.user.id);
          const { data: languages, error: langError } = await supabase
            .from("user_info")
            .select(
              "my_language, learn_language, learn_language:language!user_info_learn_language_fkey(language_img_url, language_name), my_language:language!user_info_my_language_fkey(language_img_url, language_name)"
            )
            .eq("id", data.user.id)
            .single();

          if (langError) throw langError;

          if (languages) {
            setCurrentMyLanguage(languages.my_language.language_name);
            setCurrentLearnLanguage(languages.learn_language.language_name);
            if (languages.my_language) {
              setMyLanguageUrl(languages.my_language.language_img_url);
            }
            if (languages.learn_language) {
              setLearnLanguageUrl(languages.learn_language.language_img_url);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const { data, error } = await supabase.from("language").select("*");
        if (error) throw error;
        setLanguageOptions(data);
      } catch (error) {
        console.error("no language", error);
      }
    };

    fetchLanguages();
  }, []);

  const handleMyLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMyLanguage(event.target.value);
  };

  const handleLearnLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLearnLanguage(event.target.value);
  };

  const handleUpdateMyLanguage = async () => {
    if (!userId || !selectedMyLanguage) return;

    try {
      const message = await updateMyLanguage(userId, selectedMyLanguage);
      alert(message);
      setCurrentMyLanguage(selectedMyLanguage);
    } catch (error) {
      console.error("언어 설정 저장 오류:", error);
      alert("언어 설정 저장 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateLearnLanguage = async () => {
    if (!userId || !selectedLearnLanguage) return;

    try {
      const message = await updateLearnLanguage(userId, selectedLearnLanguage);
      alert(message);
      setCurrentLearnLanguage(selectedLearnLanguage);
      console.log("Language preference updated successfully.");
    } catch (error) {
      console.error("언어 설정 저장 오류:", error);
      alert("언어 설정 저장 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      console.log("User logged out.");
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
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
      console.log("User account cancelled successfully.");
      handleLogout();
    } catch (error) {
      console.error("회원 탈퇴 오류:", error);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <h3>내 언어: {currentMyLanguage}</h3>{" "}
        {myLanguageUrl && <Image src={myLanguageUrl} alt="내 언어 이미지" width={32} height={32} className="rounded" />}
        <div className="flex flex-row w-[50%]">
          <ImageSelectorDropDown
            selectedLanguage={selectedMyLanguage}
            languageOptions={languageOptions}
            onLanguageChange={handleMyLanguageChange}
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
            onLanguageChange={handleLearnLanguageChange}
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

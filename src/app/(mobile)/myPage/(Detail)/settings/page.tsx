"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/utils/myPage/logout";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateLearnLanguage, updateMyLanguage } from "@/utils/myPage/updateLanguage";
import ImageSelectorDropDown from "@/components/myPage/LanguageSelectorDropDown";
import Image from "next/image";
import { requestNotificationPermission } from "@/utils/notifications/pushSubscription";
import BackButton from "@/components/BackButton";

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
  const [isNotificationEnabled, setIsNotificationEnabled] = useState<boolean>(false);

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

        const { data: existingSubscription } = await supabase
          .from("subscriptions")
          .select("subscription")
          .eq("user_id", data.session.user.id)
          .single();

        setIsNotificationEnabled(!!existingSubscription);
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

  const handleUpdateMyLanguage = async (language: string) => {
    if (!userId || !language) return;

    try {
      await updateMyLanguage(userId, language);
      setCurrentMyLanguage(language);
      const selectedLanguage = languageOptions.find((lang) => lang.language_name === language);
      if (selectedLanguage) {
        setMyLanguageUrl(selectedLanguage.language_img_url);
      }
    } catch {
      alert("언어 설정 저장 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateLearnLanguage = async (language: string) => {
    if (!userId || !language) return;

    try {
      await updateLearnLanguage(userId, language);
      setCurrentLearnLanguage(language);
      const selectedLanguage = languageOptions.find((lang) => lang.language_name === language);
      if (selectedLanguage) {
        setLearnLanguageUrl(selectedLanguage.language_img_url);
      }
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

  const enableNotifications = async () => {
    if (userId) {
      const permissionResult = await requestNotificationPermission(userId);
      if (permissionResult) {
        setIsNotificationEnabled(true);
      }
    }
  };

  const disableNotifications = async () => {
    if (userId) {
      try {
        await supabase.from("subscriptions").delete().eq("user_id", userId);
        setIsNotificationEnabled(false);
      } catch (err) {
        alert("알림 비활성화 중 오류가 발생했습니다.");
        console.error(err);
      }
    }
  };

  const handleNotificationToggle = async () => {
    if (isNotificationEnabled) {
      await disableNotifications();
    } else {
      await enableNotifications();
    }
  };

  return (
    <div className="p-4 bg-white">
      <BackButton title="설정" />
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <h3>내 언어</h3>
          {currentMyLanguage}
          {myLanguageUrl && (
            <Image src={myLanguageUrl} alt="내 언어 이미지" width={32} height={32} className="rounded" />
          )}
          <div className="flex flex-row w-[50%]">
            <ImageSelectorDropDown
              selectedLanguage={selectedMyLanguage}
              languageOptions={languageOptions}
              onLanguageChange={(language) => {
                setSelectedMyLanguage(language);
                handleUpdateMyLanguage(language);
              }}
            />
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
                handleUpdateLearnLanguage(language);
              }}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <h3>알림 설정</h3>
          <div
            onClick={handleNotificationToggle}
            className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
              isNotificationEnabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                isNotificationEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>
        <button onClick={handleLogout} className="w-[50%] p-4">
          로그아웃
        </button>
        <button onClick={cancelAccount} className="w-[50%] p-4">
          회원 탈퇴
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;

"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/utils/myPage/logout";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateLearnLanguage, updateMyLanguage } from "@/utils/myPage/updateLanguage";
import ImageSelectorDropDown from "@/components/myPage/LanguageSelectorDropDown";
import { requestNotificationPermission } from "@/utils/notifications/pushSubscription";
import WithIconHeader from "@/components/ui/WithIconHeader";

type LanguageType = {
  id: number;
  language_name: string;
  language_img_url: string;
};

const SettingsPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [languageOptions, setLanguageOptions] = useState<LanguageType[]>([]);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState<boolean>(false);
  const [myLanguage, setMyLanguage] = useState<string>("");
  const [learnLanguage, setLearnLanguage] = useState<string>("");

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

        if (langError) {
          console.error(langError);
          return;
        }

        if (languages) {
          setMyLanguage(languages.my_language?.language_name || "");
          setLearnLanguage(languages.learn_language?.language_name || "");
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
  }, [supabase]);

  useEffect(() => {
    const fetchLanguages = async () => {
      const { data, error } = await supabase.from("language").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setLanguageOptions(data);
    };

    fetchLanguages();
  }, [supabase]);

  const handleUpdateMyLanguage = async (language: string) => {
    if (!userId || !language) return;

    try {
      await updateMyLanguage(userId, language);
      setMyLanguage(language);
    } catch (err) {
      alert("언어 설정 저장 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleUpdateLearnLanguage = async (language: string) => {
    if (!userId || !language) return;

    try {
      await updateLearnLanguage(userId, language);
      setLearnLanguage(language);
    } catch (err) {
      alert("언어 설정 저장 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
      console.error(err);
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
    } catch (err) {
      alert("회원 탈퇴 중 오류가 발생했습니다.");
      console.error(err);
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
    <div className="bg-white w-full">
      <WithIconHeader title="설정" />
      <div className="flex flex-col">
        <ImageSelectorDropDown
          text="내 모국어 변경"
          subtitle={myLanguage}
          languageOptions={languageOptions}
          onLanguageChange={handleUpdateMyLanguage}
        />
        <ImageSelectorDropDown
          text="학습 언어 변경"
          subtitle={learnLanguage}
          languageOptions={languageOptions}
          onLanguageChange={handleUpdateLearnLanguage}
        />
        <div className="border-b border-[#f3f3f3] flex flex-row items-center justify-between py-[20px] px-2">
          <h3 className="text-black text-lg font-medium font-['Pretendard'] leading-normal">알림 설정</h3>
          <div
            onClick={handleNotificationToggle}
            className={`w-12 h-7 px-[3px] py-0.5 rounded-full flex justify-between items-center gap-2.5 cursor-pointer ${
              isNotificationEnabled ? "bg-[#96db5b]" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow transform duration-300 ease-in-out ${
                isNotificationEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="border-b border-[#f3f3f3] text-left w-full py-[20px] text-black text-lg font-medium font-['Pretendard'] leading-normal px-2"
        >
          로그아웃
        </button>
        <button
          onClick={cancelAccount}
          className="border-b border-[#f3f3f3] text-left w-full py-[20px]  text-black text-lg font-medium font-['Pretendard'] leading-normal px-2"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;

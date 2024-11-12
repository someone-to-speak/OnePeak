"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/utils/myPage/logout";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateLearnLanguage, updateMyLanguage } from "@/utils/myPage/updateLanguage";
import ImageSelectorDropDown from "@/components/myPage/LanguageSelectorDropDown";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { Typography } from "@/components/ui/typography";
import NotificationToggle from "@/components/ui/toggle/notificationToggle";
import { useUser } from "@/hooks/useUser";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { useLanguages } from "@/hooks/useLanguages";

const SettingsPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const { userInfo } = useUser();

  const { data: profile, isLoading: profileLoading } = useUserProfile(userInfo?.id || "");

  const { data: languageData, isLoading: languageLoading } = useLanguages();
  const { isNotificationEnabled, handleNotificationToggle } = useSubscription(userInfo?.id || "");
  const [myLanguage, setMyLanguage] = useState<string>(profile?.my_language?.language_name || "");
  const [learnLanguage, setLearnLanguage] = useState<string>(profile?.learn_language?.language_name || "");

  useEffect(() => {
    if (profile) {
      setMyLanguage(profile.my_language?.language_name || "");
      setLearnLanguage(profile.learn_language?.language_name || "");
    }
  }, [profile]);

  if (profileLoading || languageLoading) return <p>Loading...</p>;

  const handleUpdateMyLanguage = async (language: string) => {
    if (!userInfo?.id || !language) return;
    try {
      await updateMyLanguage(userInfo.id, language);
      setMyLanguage(language);
    } catch (err) {
      alert("언어 설정 저장 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleUpdateLearnLanguage = async (language: string) => {
    if (!userInfo?.id || !language) return;

    try {
      await updateLearnLanguage(userInfo.id, language);
      setLearnLanguage(language);
    } catch (err) {
      alert("언어 설정 저장 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleLogout = async () => {
    if (!userInfo?.id) return;
    try {
      await logout();
      router.push("/");
    } catch (err) {
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  const cancelAccount = async () => {
    if (!userInfo?.id) return;
    const confirmation = confirm("정말 회원 계정을 탈퇴하시겠습니까?");
    if (!confirmation) return;

    try {
      const { error } = await supabase.from("user_info").update({ is_deleted: true }).eq("id", userInfo.id);
      if (error) throw error;
      alert("회원 계정이 성공적으로 탈퇴되었습니다.");
      handleLogout();
    } catch (err) {
      alert("회원 탈퇴 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  if (!userInfo?.id) return null;

  return (
    <div className="bg-white">
      <WithIconHeader title="설정" />
      <div className="flex flex-col mt-0 md:mt-[70px] sm:w-[674px] mx-auto">
        {languageData.length > 0 && (
          <>
            <ImageSelectorDropDown
              text="내 모국어 변경"
              subtitle={myLanguage}
              languageOptions={languageData}
              onLanguageChange={handleUpdateMyLanguage}
            />
            <ImageSelectorDropDown
              text="학습 언어 변경"
              subtitle={learnLanguage}
              languageOptions={languageData}
              onLanguageChange={handleUpdateLearnLanguage}
            />
          </>
        )}
        <div className="border-b border-gray-800 flex flex-row items-center justify-between py-[20px] px-2">
          <Typography size={16} weight="medium">
            알림 설정
          </Typography>
          <NotificationToggle isEnabled={isNotificationEnabled} onToggle={handleNotificationToggle} />
        </div>
        <button onClick={handleLogout} className="border-b border-gray-800 text-left w-full py-[20px] px-2">
          <Typography size={16} weight="medium">
            로그아웃
          </Typography>
        </button>
        <button onClick={cancelAccount} className="border-b border-gray-800 text-left w-full py-[20px] px-2">
          <Typography size={16} weight="medium">
            회원탈퇴
          </Typography>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;

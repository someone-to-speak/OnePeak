"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/utils/myPage/logout";
import { useState, useEffect } from "react";
import { updateLearnLanguage, updateMyLanguage } from "@/utils/myPage/updateLanguage";
import ImageSelectorDropDown from "@/components/myPage/LanguageSelectorDropDown";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { Typography } from "@/components/ui/typography";
import NotificationToggle from "@/components/ui/toggle/notificationToggle";
import { useUser } from "@/hooks/useUser";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { useLanguages } from "@/hooks/useLanguages";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "react-toastify";
import { cancelAccount } from "@/utils/myPage/cancelAccount";

const SettingsPage = () => {
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

  if (profileLoading || languageLoading) return <LoadingSpinner />;

  const handleUpdateMyLanguage = async (language: string) => {
    if (!userInfo?.id || !language) return;
    try {
      await updateMyLanguage(userInfo.id, language);
      setMyLanguage(language);
    } catch {
      toast.error("언어설정에 오류가 생겼습니다.");
    }
  };

  const handleUpdateLearnLanguage = async (language: string) => {
    if (!userInfo?.id || !language) return;

    try {
      await updateLearnLanguage(userInfo.id, language);
      setLearnLanguage(language);
    } catch {
      toast.error("언어설정에 오류가 생겼습니다.");
    }
  };

  const handleLogout = async () => {
    if (!userInfo?.id) return;
    try {
      await logout();
      router.push("/");
    } catch {
      toast.error("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!userInfo?.id) return null;

  return (
    <div className="flex flex-col md:gap-[70px]">
      <WithIconHeader title="설정" />
      <div className="flex flex-col w-full md:w-[674px] mx-auto">
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
        <button
          onClick={() => cancelAccount({ userInfo, handleLogout })}
          className="border-b border-gray-800 text-left w-full py-[20px] px-2"
        >
          <Typography size={16} weight="medium">
            회원탈퇴
          </Typography>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;

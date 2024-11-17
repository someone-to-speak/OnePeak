"use client";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/myPage/logout";
import { useState, useEffect } from "react";
import { updateMyLanguage } from "@/utils/myPage/updateLanguage";
import ImageSelectorDropDown from "@/components/myPage/LanguageSelectorDropDown";
import { Typography } from "@/components/ui/typography";
import NotificationToggle from "@/components/ui/toggle/notificationToggle";
import { useUser } from "@/hooks/useUser";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSubscription } from "@/hooks/useSubscription";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "react-toastify";
import { fetchLanguageName } from "@/api/firstSetting/fetchLanguageName";
import { useQuery } from "@tanstack/react-query";
import WithIconHeader from "@/components/ui/WithIconHeader";
import ChatModal from "@/components/ChatModal";
import { cancelAccount } from "@/utils/myPage/cancelAccount";

const SettingsPage = () => {
  const router = useRouter();
  const { userInfo } = useUser();
  const { data: profile, isLoading: profileLoading } = useUserProfile(userInfo?.id || "");
  const { isNotificationEnabled, handleNotificationToggle } = useSubscription(userInfo?.id || "");
  const [myLanguage, setMyLanguage] = useState<string>(profile?.my_language?.language_name || "");
  const [isAccountDeletionModalOpen, setIsAccountDeletionModalOpen] = useState(false);
  const [isLanguageUpdateModalOpen, setIsLanguageUpdateModalOpen] = useState(false);

  const handleAccountDeletion = async () => {
    const onConfirm = () => confirm("정말 탈퇴하시겠습니까?"); // 확인 모달

    await cancelAccount({
      userInfo,
      handleLogout: () => {
        console.log("로그아웃 완료");
      },
      onConfirm
    });
  };

  const {
    data: languages,
    error: languagesError,
    isLoading: languagesLoading
  } = useQuery({
    queryKey: ["language"],
    queryFn: () => fetchLanguageName()
  });
  if (languagesError) return;

  useEffect(() => {
    if (profile) {
      setMyLanguage(profile.my_language?.language_name || "");
    }
  }, [profile]);

  if (profileLoading || languagesLoading) return <LoadingSpinner />;

  const filteredMyLanguages = languages?.filter((language) => language.language_name !== myLanguage) || [];

  const handleUpdateMyLanguage = async (language: string) => {
    if (!userInfo?.id || !language) return;
    try {
      await updateMyLanguage(userInfo.id, language);
      setMyLanguage(language);
      setIsLanguageUpdateModalOpen(true); // 언어 변경 모달 열기
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

  if (!userInfo?.id || !languages) return null;

  return (
    <div className="flex flex-col md:gap-[70px]">
      <WithIconHeader title="설정" />
      <div className="flex flex-col w-full md:w-[674px] mx-auto">
        {languages.length > 0 && (
          <>
            <ImageSelectorDropDown
              text="내 모국어 변경"
              subtitle={myLanguage}
              languageOptions={filteredMyLanguages}
              onLanguageChange={handleUpdateMyLanguage}
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
          onClick={() => setIsAccountDeletionModalOpen(true)} // 모달 열기
          className="border-b border-gray-800 text-left w-full py-[20px] px-2"
        >
          <Typography size={16} weight="medium">
            회원탈퇴
          </Typography>
        </button>
        {/* 회원탈퇴 모달 */}
        <ChatModal
          isOpen={isAccountDeletionModalOpen}
          onClose={() => setIsAccountDeletionModalOpen(false)}
          onConfirm={handleAccountDeletion}
          title="알림"
          description="탈퇴하시겠습니까?"
          confirmText="확인"
          confirmButtonStyle="primary"
          showCancel={true}
        />
        {/* 언어 변경 성공 모달 */}
        <ChatModal
          isOpen={isLanguageUpdateModalOpen}
          onClose={() => setIsLanguageUpdateModalOpen(false)}
          onConfirm={() => setIsLanguageUpdateModalOpen(false)}
          title="알림"
          description="모국어가 변경되었습니다."
          confirmText="확인"
          confirmButtonStyle="primary"
          showCancel={false}
        />
      </div>
    </div>
  );
};

export default SettingsPage;

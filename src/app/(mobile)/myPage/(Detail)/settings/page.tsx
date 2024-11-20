"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/utils/myPage/logout";
import { useState } from "react";
import { updateMyLanguage } from "@/utils/myPage/updateLanguage";
import ImageSelectorDropDown from "@/components/myPage/LanguageSelectorDropDown";
import { Typography } from "@/components/ui/typography";
import NotificationToggle from "@/components/ui/toggle/notificationToggle";
import { useUser } from "@/hooks/useUser";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSubscription } from "@/hooks/useSubscription";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { fetchLanguageName } from "@/api/firstSetting/fetchLanguageName";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WithIconHeader from "@/components/ui/WithIconHeader";
import ChatModal from "@/components/ChatModal";
import { cancelAccount } from "@/utils/myPage/cancelAccount";

const SettingsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isAccountDeletionModalOpen, setIsAccountDeletionModalOpen] = useState(false);
  const [isLanguageUpdateModalOpen, setIsLanguageUpdateModalOpen] = useState(false);

  const { userInfo, isLoading } = useUser();
  const { data: profile, isLoading: profileLoading } = useUserProfile(userInfo?.id || "");
  const { isNotificationEnabled, handleNotificationToggle } = useSubscription(userInfo?.id || "");

  const handleAccountDeletion = async () => {
    if (!userInfo) {
      return;
    }
    await cancelAccount({
      userInfo,
      onConfirm: () => {
        handleLogout();
        return true;
      },
      handleLogout
    });
  };

  const {
    data: languages,
    error: languagesError,
    isLoading: languagesLoading
  } = useQuery({
    queryKey: ["languagesInfo"],
    queryFn: () => fetchLanguageName()
  });

  const handleUpdateMyLanguage = async (language: string) => {
    if (!userInfo?.id || !language) return;
    await updateMyLanguage(userInfo.id, language);
    setIsLanguageUpdateModalOpen(true);
  };

  const { mutate: updateMyLanguageMutate } = useMutation({
    mutationFn: handleUpdateMyLanguage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userProfile", userInfo?.id] })
  });

  if (languagesError) return;
  if (isLoading || profileLoading || languagesLoading) return <LoadingSpinner />;

  const filteredMyLanguages =
    languages?.filter((language) => language.language_name !== profile?.my_language?.language_name) || [];

  const handleLogout = async () => {
    if (!userInfo?.id) return;
    await logout();
    router.push("/");
  };
  if (!userInfo?.id || !languages || !profile?.my_language) return;

  return (
    <div className="flex flex-col md:gap-[70px]">
      <WithIconHeader title="설정" />
      <div className="flex flex-col w-full md:w-[674px] mx-auto">
        {languages.length > 0 && (
          <>
            <ImageSelectorDropDown
              text="내 모국어 변경"
              subtitle={profile?.my_language?.language_name}
              languageOptions={filteredMyLanguages}
              onLanguageChange={updateMyLanguageMutate}
            />
          </>
        )}
        <div className="border-b border-gray-800 flex flex-row items-center justify-between py-[20px] px-2">
          <Typography size={16} weight="medium" className="md:text-[20px]">
            알림 설정
          </Typography>
          <NotificationToggle isEnabled={isNotificationEnabled} onToggle={handleNotificationToggle} />
        </div>
        <button onClick={handleLogout} className="border-b border-gray-800 text-left w-full py-[20px] px-2">
          <Typography size={16} weight="medium" className="md:text-[20px]">
            로그아웃
          </Typography>
        </button>
        <button
          onClick={() => setIsAccountDeletionModalOpen(true)}
          className="border-b border-gray-800 text-left w-full py-[20px] px-2"
        >
          <Typography size={16} weight="medium" className="md:text-[20px]">
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

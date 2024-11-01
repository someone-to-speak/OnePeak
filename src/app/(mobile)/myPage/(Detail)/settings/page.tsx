"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/myPage/logout";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateMyLanguage } from "@/utils/myPage/updateLanguage";
import ImageSelectorDropDown from "@/components/myPage/LanguageSelectorDropDown";

type LanguageType = {
  id: number;
  language_name: string;
  language_img_url: string;
};
const supabase = createClient();

const SettingsPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [languageOptions, setLanguageOptions] = useState<LanguageType[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (data.user) {
          setUserId(data.user.id);
          console.log("User ID fetched:", data.user.id);
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
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  const handleLanguageChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    console.log("Language selected:", newLanguage);

    if (!userId) return;

    try {
      const message = await updateMyLanguage(userId, newLanguage);
      alert(message);
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
      <ImageSelectorDropDown
        selectedLanguage={selectedLanguage}
        languageOptions={languageOptions}
        onLanguageChange={handleLanguageChange}
      />
      <div className="p-4">
        <Link href="/myPage/settings/noticeSetting">알림 설정</Link>
      </div>
      <button onClick={handleLogout} className="hover:bg-red-600 p-4">
        로그아웃
      </button>
      <button onClick={cancelAccount} className="hover:bg-red-600 p-4">
        회원 탈퇴
      </button>
    </div>
  );
};

export default SettingsPage;

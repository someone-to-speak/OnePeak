"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/myPage/logout";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

const SettingsPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("Error fetching user:", error);
      } else {
        setTargetUser(data.user);
      }
    };

    fetchUser();
  }, []);

  // 로그아웃
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  }, [router]);

  // 회원탈퇴
  const cancelAccount = async (targetUser: User) => {
    const confirmation = confirm("정말 회원 계정을 탈퇴시키겠습니까?");
    if (!confirmation) return;

    const { error } = await supabase.from("user_info").update({ is_deleted: true }).eq("id", targetUser.id);

    if (error) {
      console.log("Error", error.message);
      setError("사용자 계정을 탈퇴시키는데 실패하였습니다.");
    } else {
      alert("회원 계정이 성공적으로 탈퇴되었습니다.");
      handleLogout();
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col">
      <Link href="/myPage/settings/languageSetting">언어 변경</Link>
      <Link href="/myPage/settings/noticeSetting">알림 설정</Link>
      <button onClick={handleLogout} className="text-white bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2">
        로그아웃
      </button>
      <button
        onClick={() => targetUser && cancelAccount(targetUser)}
        className="text-white bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2 mt-2"
      >
        회원 탈퇴
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SettingsPage;

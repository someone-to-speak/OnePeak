"use client";

import UserProfilePage from "@/components/myPage/UserProfile";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MyPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id);
      }
    };

    fetchUserId();
  }, [supabase, router]);

  if (!userId) return null;

  return (
    <div className="flex flex-col">
      <UserProfilePage userId={userId} />
      <Link href="/myPage/faq">1:1 문의하기</Link>
      <Link href="/myPage/subscription">구독관리</Link>
      <Link href="/myPage/settings">설정</Link>
      <Link href="/myPage/privacyPolicy">개인정보 보호 정책</Link>
      <Link href="/myPage/servicePolicy">서비스 이용약관</Link>
    </div>
  );
};

export default MyPage;

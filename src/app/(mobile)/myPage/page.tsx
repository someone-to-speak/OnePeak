"use client";

import UserProfilePage from "@/components/myPage/UserProfile";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

const MyPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id);
      }
    };

    fetchUserId();
  }, [supabase]);

  if (!userId) return null;

  return (
    <Suspense>
      <WithIconHeader title="내 정보" />
      <div className="flex flex-col">
        <UserProfilePage userId={userId} />
        <Link href="/myPage/faq">1:1 문의하기</Link>
        <Link href="/myPage/subscription">구독관리</Link>
        <Link href="/myPage/settings">설정</Link>
        <Link href="/myPage/privacyPolicy">개인정보 보호 정책</Link>
        <Link href="/myPage/servicePolicy">서비스 이용약관</Link>
      </div>
    </Suspense>
  );
};

export default MyPage;

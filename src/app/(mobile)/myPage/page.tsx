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
        <div className="border-b border-[#f3f3f3] flex flex-row items-center justify-between py-[20px] px-2">
          <Link href="/myPage/faq" className="text-black text-base font-medium font-['Pretendard'] leading-normal">
            1:1 문의하기
          </Link>
        </div>
        <div className="border-b border-[#f3f3f3] flex flex-row items-center justify-between py-[20px] px-2">
          <Link
            href="/myPage/subscription"
            className="text-black text-base font-medium font-['Pretendard'] leading-normal"
          >
            구독관리
          </Link>
        </div>
        <div className="border-b border-[#f3f3f3] flex flex-row items-center justify-between py-[20px] px-2">
          <Link href="/myPage/settings" className="text-black text-base font-medium font-['Pretendard'] leading-normal">
            설정
          </Link>
        </div>
        <div className="border-b border-[#f3f3f3] flex flex-row items-center justify-between py-[20px] px-2">
          <Link
            href="/myPage/privacyPolicy"
            className="text-black text-base font-medium font-['Pretendard'] leading-normal"
          >
            개인정보 보호 정책
          </Link>
        </div>
        <div className="border-b border-[#f3f3f3] flex flex-row items-center justify-between py-[20px] px-2">
          <Link
            href="/myPage/servicePolicy"
            className="text-black text-base font-medium font-['Pretendard'] leading-normal"
          >
            서비스 이용약관
          </Link>
        </div>
      </div>
    </Suspense>
  );
};

export default MyPage;

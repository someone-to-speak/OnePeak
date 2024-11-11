"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import UserProfilePage from "@/components/myPage/UserProfile";
import { Typography } from "@/components/ui/typography";
import NoIconHeader from "@/components/ui/NoIconHeader";

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
      <NoIconHeader title="내정보" />
      <div className="flex flex-col">
        <UserProfilePage userId={userId} />
        {[
          { href: "/myPage/faq", label: "1:1 문의하기" },
          { href: "/myPage/subscription", label: "구독관리" },
          { href: "/myPage/settings", label: "설정" },
          { href: "/myPage/privacyPolicy", label: "개인정보 보호 정책" },
          { href: "/myPage/servicePolicy", label: "서비스 이용약관" }
        ].map(({ href, label }) => (
          <div key={href} className="border-b border-gray-800 py-[20px]">
            <Link href={href}>
              <Typography size={16} weight="medium">
                {label}
              </Typography>
            </Link>
          </div>
        ))}
      </div>
    </Suspense>
  );
};

export default MyPage;

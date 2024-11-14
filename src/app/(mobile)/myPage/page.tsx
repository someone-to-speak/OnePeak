"use client";

import Link from "next/link";
import UserProfilePage from "@/components/myPage/UserProfile";
import { Typography } from "@/components/ui/typography";
import NoIconHeader from "@/components/ui/NoIconHeader";
import { useUser } from "@/hooks/useUser";

const MyPage = () => {
  const { userInfo } = useUser();

  if (!userInfo?.id) return null;

  return (
    <div className="flex flex-col md:gap-[60px]">
      <NoIconHeader title="내정보" />
      <div className="flex flex-col justify-center w-full md:w-[674px] mx-auto">
        <UserProfilePage userId={userInfo.id} />
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
    </div>
  );
};

export default MyPage;

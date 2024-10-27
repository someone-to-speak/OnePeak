"use client";

import UserProfile from "@/components/profile/UserProfile";
import Link from "next/link";

const MyPage = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <UserProfile />

      <Link href="/faq">
        <a className="text-blue-500 hover:text-blue-700">1:1 문의하기</a>
      </Link>

      <Link href="/subscription">
        <a className="text-blue-500 hover:text-blue-700">구독관리</a>
      </Link>

      <Link href="/settings">
        <a>설정</a>
      </Link>

      <Link href="/privacyPolicy">
        <a className="text-blue-500 hover:text-blue-700">개인정보 보호 정책</a>
      </Link>

      <Link href="/servicePolicy">
        <a className="text-blue-500 hover:text-blue-700">서비스 이용약관</a>
      </Link>
    </div>
  );
};

export default MyPage;

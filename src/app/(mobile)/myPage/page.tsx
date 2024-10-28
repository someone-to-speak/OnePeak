"use client";

import UserProfile from "@/components/profile/UserProfile";
import Link from "next/link";

const MyPage = () => {
  return (
    <div className="flex flex-col">
      <UserProfile />
      <Link href="/myPage/faq">1:1 문의하기</Link>
      <Link href="/myPage/subscription">구독관리</Link>
      <Link href="/myPage/settings">설정</Link>
      <Link href="/myPage/privacyPolicy">개인정보 보호 정책</Link>
      <Link href="/myPage/servicePolicy">서비스 이용약관</Link>
    </div>
  );
};

export default MyPage;

"use client";

import Header from "@/components/header/Header";
import "../globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navibar from "@/components/nav/Navibar";
import { usePathname } from "next/navigation";

export default function MobileLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // 디버깅을 위해 pathname 값 확인
  console.log("Current pathname:", pathname);

  // pathname이 null이 아니면 특정 경로에서 헤더와 푸터 숨기기
  // const hideHeaderFooter = pathname !== null && ["/loginInfo/*"].includes(pathname);
  const hideHeaderFooter = pathname !== null && pathname.startsWith("/loginInfo");

  return (
    <div>
      <div className="w-full min-w-[320px] max-w-[600px] mx-auto my-0  min-h-full">
        {!hideHeaderFooter && <Header />}
        {children}
        {!hideHeaderFooter && <Navibar />}
      </div>
    </div>
  );
}

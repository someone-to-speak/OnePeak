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

  const showNavbar =
    pathname === "/" ||
    pathname === "/challenge" ||
    pathname === "/myPage" ||
    pathname === "/editProfile" ||
    pathname === "/chat" ||
    pathname === "/lesson";

  return (
    <div>
      <div className="w-full min-w-[320px] max-w-[600px] mx-auto my-0  min-h-full">
        {children}
        {showNavbar && <Navibar />}
      </div>
    </div>
  );
}

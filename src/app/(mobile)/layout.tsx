"use client";

import "../globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { usePathname } from "next/navigation";
import NavbarGnb from "@/components/ui/NavbarGnb";
import ScreenSizeInitializer from "./ScreenSizeInitializer";
import { useScreenSizeStore } from "@/shared/screen-store-provider";
import Footer from "@/components/ui/footer/Footer";
import HeaderTop from "@/components/ui/header/HeaderTop";
import path from "path";

export default function MobileLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

  const showNavbar =
    pathname === "/" ||
    pathname === "/challenge" ||
    pathname === "/myPage" ||
    pathname === "/chat" ||
    pathname === "/lesson" ||
    pathname === "/myPage/editProfile";

  const ignoredPaddingWithPath =
    pathname?.startsWith("/lesson") || pathname?.endsWith("/") || pathname?.startsWith("/chat");

  return (
    <div>
      <ScreenSizeInitializer />
      {isLargeScreen && <HeaderTop />}
      <div className="w-full max-w-[1024px] min-w-[320px] flex flex-col mx-auto my-0 min-h-full">
        <div className={`${!ignoredPaddingWithPath && "px-4"}`}>
          <main>{children}</main>
        </div>
        {isLargeScreen && !pathname?.startsWith("/chat/room") ? <Footer /> : showNavbar && <NavbarGnb />}
      </div>
    </div>
  );
}

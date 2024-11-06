"use client";

import "../globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { usePathname } from "next/navigation";
import NavbarGnb from "@/components/ui/NavbarGnb";

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
    pathname === "/chat" ||
    pathname === "/lesson" ||
    pathname === "/myPage/editProfile";

  return (
    <div>
      <div className="w-[375px] flex flex-col mx-auto my-0 min-h-full">
        <div className="px-4">
          <main>{children}</main>
        </div>
        {showNavbar && <NavbarGnb />}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import LogoIcon from "@/assets/logo-icon.svg";
import BellIcon from "@/assets/bell-ringing.svg";
import CalendarIcon from "@/assets/calendar.svg";

const Header = () => {
  return (
    <header className="w-full sticky top-0 left-0 right-0 mx-[16px] mt-0 z-[200] ml-[-0px] px-[16px]">
      <div className="w-full h-12 flex justify-between items-center bg-white">
        <Image src={LogoIcon} alt="logo-icon" className="h-[27px]" />
        <div className="flex items-center gap-[16px]">
          <Link href="/notifications">
            <Image src={BellIcon} alt="bell-icon" className="w-6 h-6" />
          </Link>
          <Link href="/attendance">
            <Image src={CalendarIcon} alt="chalendar-icon" className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

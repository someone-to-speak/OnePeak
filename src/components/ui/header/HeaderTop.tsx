"use client";

import Image from "next/image";
import Link from "next/link";
import LogoIcon from "@/assets/logo-icon.svg";
import UserIcon from "@/assets/user-icon.svg";
import CalendarIcon from "@/assets/calendar.svg";
import NotificationBell from "../../notificationPopup/NotificationBell";
import { Typography } from "../typography";

const HeaderTop = () => {
  return (
    <div className="border-b border-gray-900">
      <header className="max-w-[1024px] min-w-[320px] bg-white sticky top-0 mt-0 z-[200] mx-auto">
        <div className="w-full h-[68px] flex justify-between items-center">
          <Link href="/">
            <Image src={LogoIcon} alt="logo-icon" className="h-[27px]" />
          </Link>
          <div className="w-[230px] flex flex-row justify-between gap-[36px]">
            <Link href="/lesson">
              <Typography size={16} weight="medium">
                언어수업
              </Typography>
            </Link>
            <Link href="/chat">
              <Typography size={16} weight="medium">
                채팅방
              </Typography>
            </Link>
            <Link href="/challenge">
              <Typography size={16} weight="medium">
                챌린지
              </Typography>
            </Link>
          </div>
          <div className="flex items-center gap-[16px]">
            <NotificationBell />
            <Link href="/attendance">
              <Image src={CalendarIcon} alt="chalendar-icon" className="w-7 h-7" />
            </Link>
            <Link
              href="/myPage"
              className="bg-gray-900 hover:bg-gray-800 w-[48px] h-[48px] rounded-full flex items-center justify-center"
            >
              <Image src={UserIcon} alt="user-icon" className="w-7 h-7" />
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HeaderTop;

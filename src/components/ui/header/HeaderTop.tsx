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
    <header className="w-full bg-white sticky top-0 left-0 right-0 mt-0 z-[200] ml-[-0px] px-[12px]">
      <div className="w-full h-[68px] flex justify-between items-center border-b border-gray-900">
        <Image src={LogoIcon} alt="logo-icon" className="h-[27px]" />
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
  );
};

export default HeaderTop;

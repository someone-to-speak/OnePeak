"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BellIcon from "@/assets/bell-ringing.svg";
import NotificationPopup from "./NotificationPopup";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null); // 타입 지정

  // 외부 클릭 시 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popupRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 focus:outline-none">
        <Image src={BellIcon} alt="알림" width={24} height={24} />
      </button>

      {isOpen && <NotificationPopup />}
    </div>
  );
};

export default NotificationBell;

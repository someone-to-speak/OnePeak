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
    <div ref={popupRef} className="w-7 h-7">
      <button onClick={() => setIsOpen(!isOpen)}>
        <Image src={BellIcon} alt="알림" width={28} height={28} />
      </button>

      {isOpen && <NotificationPopup />}
    </div>
  );
};

export default NotificationBell;

"use client";
import BottomSheetModal from "@/components/BottomSheetModal";
import CustomizedLearn from "@/components/chatBot/aiTutorHome/CustomizedLearn";
import Reviewing from "@/components/chatBot/aiTutorHome/Reviewing";
import TodayLearn from "@/components/chatBot/aiTutorHome/TodayLearn";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Home() {
  // 로그인 상태를 저장
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 모달 표시 여부
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 로그인 상태를 확인하는 비동기 함수
    const checkLoginStatus = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true); // 세션이 있으면 로그인 상태로 설정
      } else {
        setShowModal(true); // 세션이 없으면 모달을 표시
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div className="w-full h-[1000px] bg-gray-100 p-5">
      {showModal && <BottomSheetModal onClose={() => setShowModal(false)} />}
      {isLoggedIn && (
        <>
          <div className="h-10"></div>
          <TodayLearn />
          <CustomizedLearn />
          <Reviewing />
        </>
      )}
    </div>
  );
}

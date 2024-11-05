"use client";

import BottomSheetModal from "@/components/BottomSheetModal";
import CustomizedLearn from "@/components/chatBot/aiTutorHome/CustomizedLearn";
import Reviewing from "@/components/chatBot/aiTutorHome/Reviewing";
import TodayLearn from "@/components/chatBot/aiTutorHome/TodayLearn";
import Header from "@/components/header/Header";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 저장
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const router = useRouter();

  useEffect(() => {
    // 로그인 상태를 확인하는 비동기 함수
    const checkLoginStatus = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setIsLoggedIn(true); // 세션이 있으면 로그인 상태로 설정
        // 로그인 후 user_info 테이블을 확인
        const { data: userInfo } = await supabase
          .from("user_info")
          .select("nickname, my_language, learn_language")
          .eq("id", data.session.user.id)
          .single();

        // userInfo가 null인지 확인한 후, 초기 정보가 없을 경우 설정 페이지로 이동
        if (!userInfo || !userInfo.nickname || !userInfo.my_language || !userInfo.learn_language) {
          router.push("/loginInfo/setNickname");
        }
        console.log("userInfo", userInfo);
      } else {
        setShowModal(true); // 세션이 없으면 모달을 표시
      }
    };

    checkLoginStatus();
  }, [router]);

  return (
    <>
      <Header />
      <div className="relative w-full h-[812px] bg-black/60 z-[9999]">
        <>
          <div className="h-10"></div>
          <TodayLearn />
          <CustomizedLearn />
          <Reviewing />
        </>
        {!isLoggedIn && showModal && (
          <div className="fixed py-[60px]  bg-white rounded-t-[30px]  bottom-0 flex justify-center items-end z-[300]">
            <BottomSheetModal onClose={() => setShowModal(false)} />
          </div>
        )}
      </div>
    </>
  );
}

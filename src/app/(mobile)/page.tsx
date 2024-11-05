"use client";

import BottomSheetModal from "@/components/BottomSheetModal";
import CustomizedLearn from "@/components/chatBot/aiTutorHome/CustomizedLearn";
import Reviewing from "@/components/chatBot/aiTutorHome/Reviewing";
import TodayLearn from "@/components/chatBot/aiTutorHome/TodayLearn";
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
    <div className="w-full h-[1000px] bg-gray-100 p-5">
      {showModal && <BottomSheetModal onClose={() => setShowModal(false)} />}
      {isLoggedIn && (
        <div className="flex flex-col gap-8">
          <TodayLearn />
          <CustomizedLearn />
          <Reviewing />
        </div>
      )}
    </div>
  );
}

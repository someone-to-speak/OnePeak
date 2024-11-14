"use client";

import BottomSheetModal from "@/components/BottomSheetModal";
import CustomizedLearn from "@/components/chatBot/aiTutorHome/CustomizedLearn";
import Reviewing from "@/components/chatBot/aiTutorHome/Reviewing";
import TodayLearn from "@/components/chatBot/aiTutorHome/TodayLearn";
import Header from "@/components/ui/header/Header";
import { useScreenSizeStore } from "@/shared/screen-store-provider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 저장
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const router = useRouter();
  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

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
          .select("nickname, my_language, learn_language, is_blocked")
          .eq("id", data.session.user.id)
          .single();

        // 차단된 사용자일 경우 홈페이지 접근 제한 1:1문의 페이지로 이동
        if (userInfo?.is_blocked === true) {
          alert("관리자에의해 차단된 사용자입니다. 문의할 점이 있다면 1:1 문의페이지를 이용해주세요");
          router.push("/myPage/faq");
        }

        // userInfo가 null인지 확인한 후, 초기 정보가 없을 경우 설정 페이지로 이동
        if (!userInfo || !userInfo.nickname || !userInfo.my_language || !userInfo.learn_language) {
          router.push("/loginInfo/setNickname");
        }
      } else {
        setShowModal(true); // 세션이 없으면 모달을 표시
      }
    };

    checkLoginStatus();
  }, [router]);

  useEffect(() => {
    // 로그인되지 않았고 모달이 표시되는 상태일 때 스크롤 비활성화
    if (!isLoggedIn && showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = ""; // 모달이 닫히면 스크롤 복구
    }

    // 컴포넌트가 언마운트될 때 스크롤 상태 복구
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoggedIn, showModal]);

  return (
    <>
      <div className="relative w-full pb-20">
        {!isLargeScreen && <Header />}
        <div className="h-10 py-4 bg-#FDFDFD"></div>
        {/* 홈 화면 콘텐츠 */}
        <TodayLearn />
        <CustomizedLearn />
        <Reviewing />
      </div>

      {/* 로그인되지 않았을 때 모달 표시 */}
      {!isLoggedIn && showModal && (
        <div className="absolute w-full md:max-w-[1056px] md:h-full top-0 bottom-0 flex items-end bg-black/60 z-[300]">
          <div className="w-full bg-white rounded-t-[30px] z-[400]">
            <BottomSheetModal onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}

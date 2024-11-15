import { signInWithProvider } from "@/services/supabaseAuth";
import React, { useState } from "react";
import naver from "@/assets/rectangle-120.svg";
import kakao from "@/assets/rectangle-123.svg";
import google from "@/assets/rectangle-125.svg";
import Image from "next/image";
import ChatModal from "./ChatModal";

// 모달을 닫기 위한 콜백 함수 타입 정의
interface BottomSheetModalProps {
  onClose: () => void;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ onClose }) => {
  const handleSignInWithGoogle = async () => {
    await signInWithProvider("google");
  };
  console.log(onClose); // build 오류 임시 해결

  // 오픈 예정 알림 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col mt-[30px] md:my-[58px] gap-[40px] justify-center items-center">
      <h1 className="text-center text-black text-6xl font-bold font-suit leading-9">SNS 로그인 하기</h1>
      <div className="flex gap-[35px] mb-[44px]">
        <button onClick={handleSignInWithGoogle}>
          <Image src={google} alt="Rectangle125" className="cursor-pointer" />
        </button>
        <button onClick={openModal}>
          <Image src={kakao} alt="Rectangle123" />
        </button>
        <button onClick={openModal}>
          <Image src={naver} alt="Rectangle120" />
        </button>
      </div>
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
        title="알림"
        description="오픈 예정입니다"
        confirmText="확인"
        confirmButtonStyle="primary"
        showCancel={false}
      />
    </div>
  );
};

export default BottomSheetModal;

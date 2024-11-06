import { signInWithProvider } from "@/services/supabaseAuth";
import React from "react";
import naver from "@/../public/images/rectangle-120.svg";
import kakao from "@/../public/images/rectangle-123.svg";
import google from "@/../public/images/rectangle-125.svg";
import Image from "next/image";

// 모달을 닫기 위한 콜백 함수 타입 정의
interface BottomSheetModalProps {
  onClose: () => void;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ onClose }) => {
  const handleSignInWithGoogle = async () => {
    console.log("zz ??");
    await signInWithProvider("google");
  };
  console.log(onClose); // build 오류 임시 해결

  return (
    <div className="flex flex-col w-[600px] h-[25%] justify-center items-center">
      <h1 className="text-center text-black text-6xl font-bold font-suit leading-9 mb-[40px]">SNS 로그인 하기</h1>
      <div className="flex gap-[70px]">
        <button onClick={handleSignInWithGoogle}>
          <Image src={google} alt="Rectangle125" className="cursor-pointer" />
        </button>

        <Image src={kakao} alt="Rectangle123" />
        <Image src={naver} alt="Rectangle120" />
      </div>
    </div>
  );
};

export default BottomSheetModal;

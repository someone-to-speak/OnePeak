"use client";

import Image from "next/image";
import caretleft from "@/assets/caret-left.svg";
import { useRouter } from "next/navigation";
import { Typography } from "./typography";

interface BackButtonProps {
  title: string; // 버튼에 표시할 텍스트
  onBack?: () => void; // 뒤로가기 버튼 동작을 정의하는 함수
}

const WithIconHeader: React.FC<BackButtonProps> = ({ title, onBack }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack(); // onBack이 정의된 경우 이를 호출
    } else {
      router.back(); // 기본 동작
    }
  };

  return (
    <div className="app-header">
      <div className="flex items-center">
        <button onClick={() => handleBack()}>
          <Image src={caretleft} alt={"caret-left"} className="app-header-icon" />
        </button>
        <Typography weight="bold" className="app-header-text">
          {title}
        </Typography>
      </div>
    </div>
  );
};

export default WithIconHeader;

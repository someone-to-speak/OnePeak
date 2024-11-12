"use client";

import Image from "next/image";
import caretleft from "@/assets/caret-left.svg";
import { useRouter } from "next/navigation";
import { Typography } from "./typography";

interface BackButtonProps {
  title: string; // 버튼에 표시할 텍스트
}

const WithIconHeader: React.FC<BackButtonProps> = ({ title }) => {
  const router = useRouter();

  return (
    <div className="app-header">
      <button onClick={() => router.back()}>
        <Image src={caretleft} alt={"caret-left"} className="app-header-icon" />
      </button>
      <Typography weight="bold" className="app-header-text">
        {title}
      </Typography>
    </div>
  );
};

export default WithIconHeader;

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
    <div className="with-icon-header">
      <button onClick={() => router.back()}>
        <Image src={caretleft} alt={"caret-left"} className="w-6 h-6 left-0 top-0" />
      </button>
      <Typography size={18} weight="bold">
        {title}
      </Typography>
    </div>
  );
};

export default WithIconHeader;

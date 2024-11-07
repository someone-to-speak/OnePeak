"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  title: string; // 버튼에 표시할 텍스트
}

const NoIconHeader: React.FC<BackButtonProps> = ({ title }) => {
  const router = useRouter();

  return (
    <div className="w-full h-12 justify-start inline-flex">
      <button onClick={() => router.back()} className="text-gray-50 text-xl font-bold font-['SUIT'] leading-[27px]">
        <div className="flex flex-row items-center gap-1.5">{title}</div>
      </button>
    </div>
  );
};

export default NoIconHeader;

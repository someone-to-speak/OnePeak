"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface OverlayProps {
  onClose: () => void;
  targetId: string;
}

const Overlay = ({ onClose, targetId }: OverlayProps) => {
  const router = useRouter();

  const handleReport = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // 신고하기 처리
    e.stopPropagation();
    router.push(`/chat/report?targetId=${targetId}`);
    onClose(); // 오버레이 닫기
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-xl font-bold">신고하기</h3>
        <button onClick={handleReport} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg">
          신고하기
        </button>
        <button onClick={onClose} className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg">
          닫기
        </button>
      </div>
    </div>
  );
};

export default Overlay;

import { signInWithProvider } from "@/app/services/supabaseAuth";
import React from "react";

// 모달을 닫기 위한 콜백 함수 타입 정의
interface BottomSheetModalProps {
  onClose: () => void;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ onClose }) => {
  const handleSignInWithGoogle = async () => {
    await signInWithProvider("google");
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-end z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-t-lg">
        <button onClick={onClose} className="text-gray-500 float-right">
          닫기
        </button>
        <h2 className="text-xl font-bold mb-4">로그인이 필요합니다</h2>
        <p className="mb-4">서비스를 이용하려면 로그인이 필요합니다.</p>
        <button onClick={handleSignInWithGoogle} className="w-full bg-blue-500 text-white py-2 rounded">
          구글
        </button>
        <button type="button">카카오</button>
        <button type="button">네이버</button>
        <button type="button">애플</button>
      </div>
    </div>
  );
};

export default BottomSheetModal;

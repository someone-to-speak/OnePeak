import { signInWithProvider } from "@/services/supabaseAuth";
import React from "react";

// 모달을 닫기 위한 콜백 함수 타입 정의
interface BottomSheetModalProps {
  onClose: () => void;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ onClose }) => {
  const handleSignInWithGoogle = async () => {
    await signInWithProvider("google");
  };
  console.log(onClose); // build 오류 임시 해결
  return (
    <div className="fixed inset-12 bg-gray-500 bg-opacity-75 flex justify-center items-end z-1">
      <div className="bg-white w-full max-w-md p-6 rounded-t-lg flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">SNS 로그인</h2>
        <div className="flex gap-10">
          <button onClick={handleSignInWithGoogle} className=" bg-blue-500 text-white py-2 rounded">
            구글
          </button>
          <button type="button" className=" bg-blue-500 text-white py-2 rounded">
            카카오
          </button>
          <button type="button" className=" bg-blue-500 text-white py-2 rounded">
            네이버
          </button>
          <button type="button" className=" bg-blue-500 text-white py-2 rounded">
            애플
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomSheetModal;

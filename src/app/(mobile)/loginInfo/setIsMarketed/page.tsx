"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isMarketed, setIsMarketed] = useState<boolean>(false);

  const handleMarketed = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;

    if (userId) {
      const { error } = await supabase.from("user_info").update({ is_marketing: isMarketed }).eq("id", userId);

      if (!error) {
        router.push("/"); // 홈화면으로 이동
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto text-center">
      <p className="text-lg font-semibold mb-4">각종 이벤트 소식 받으실래요?</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            setIsMarketed(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          동의
        </button>
        <button
          onClick={() => {
            setIsMarketed(false);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          비동의
        </button>
        <button
          onClick={handleMarketed}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          시작하기
        </button>
      </div>
    </div>
  );
};

export default page;

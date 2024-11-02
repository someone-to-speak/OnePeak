"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SetNickname() {
  const [nickname, setNickname] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleContinue = async () => {
    if (nickname) {
      const { data } = await supabase.auth.getSession();
      const userId = data?.session?.user?.id;

      console.log("User ID:", userId); // 유저 ID 확인
      console.log("Nickname to update:", nickname); // 업데이트할 닉네임 확인

      if (userId) {
        const { error } = await supabase.from("user_info").update({ nickname }).eq("user_id", userId);

        if (!error) {
          router.push("/loginInfo/setMyLanguage");
        }
      }
    }
  };

  return (
    <div>
      <h1>닉네임 알려줘</h1>
      <p>원픽에서 사용할 닉네임을 설정해 주시면 됩니다.</p>
      <div className="flex flex-col">
        <label>닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 작성해주세요"
          className="border rounded p-2"
        />
        <p>최대 12글자</p>
      </div>
      <button
        onClick={handleContinue}
        disabled={!nickname}
        className={`w-full mt-4 p-2 rounded ${nickname ? "bg-green-500" : "bg-gray-300"}`}
      >
        계속
      </button>
    </div>
  );
}

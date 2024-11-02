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
      <h2>Set your Nickname</h2>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Enter nickname"
        className="border rounded p-2"
      />
      <button
        onClick={handleContinue}
        disabled={!nickname}
        className={`mt-4 p-2 rounded ${nickname ? "bg-green-500" : "bg-gray-300"}`}
      >
        계속
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const learnLanguages = ["영어", "일본어", "스페인어", "프랑스어"];

export default function SetLearnLanguage() {
  const [selectedLearnLanguage, setSelectedLearnLanguage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleContinue = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;

    if (userId && selectedLearnLanguage) {
      const { error } = await supabase
        .from("user_info")
        .update({ learn_language: selectedLearnLanguage })
        .eq("user_id", userId);

      if (!error) {
        router.push("/"); // 홈화면으로 이동
      }
    }
  };

  return (
    <div>
      <h2>Select the Language You Want to Learn</h2>
      <div>
        {learnLanguages.map((language) => (
          <button
            key={language}
            onClick={() => setSelectedLearnLanguage(language)}
            className={`p-2 m-2 rounded ${selectedLearnLanguage === language ? "bg-green-500" : "bg-gray-300"}`}
          >
            {language}
          </button>
        ))}
      </div>
      <button
        onClick={handleContinue}
        disabled={!selectedLearnLanguage}
        className={`mt-4 p-2 rounded ${selectedLearnLanguage ? "bg-green-500" : "bg-gray-300"}`}
      >
        계속
      </button>
    </div>
  );
}

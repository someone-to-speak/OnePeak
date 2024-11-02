import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@/utils/supabase/server";

const languages = ["한국어", "일본어", "스페인어", "영어"];

export default function SetMyLanguage() {
  const [selectedMyLanguage, setSelectedMyLanguage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleContinue = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;

    if (userId && selectedMyLanguage) {
      const { error } = await supabase
        .from("user_info")
        .update({ my_language: selectedMyLanguage })
        .eq("user_id", userId);

      if (!error) {
        router.push("/loginInfo/setLearnLanguage");
      }
    }
  };

  return (
    <div>
      <h2>Select Your Native Language</h2>
      <div>
        {languages.map((language) => (
          <button
            key={language}
            onClick={() => setSelectedMyLanguage(language)}
            className={`p-2 m-2 rounded ${selectedMyLanguage === language ? "bg-green-500" : "bg-gray-300"}`}
          >
            {language}
          </button>
        ))}
      </div>
      <button
        onClick={handleContinue}
        disabled={!selectedMyLanguage}
        className={`mt-4 p-2 rounded ${selectedMyLanguage ? "bg-green-500" : "bg-gray-300"}`}
      >
        계속
      </button>
    </div>
  );
}

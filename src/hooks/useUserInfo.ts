import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "./useUser";

export const useLearnLanguage = () => {
  const [learnLanguage, setLearnLanguage] = useState<string>("");
  const supabase = createClient();
  const { userInfo } = useUser();

  useEffect(() => {
    const fetchLearnLanguage = async () => {
      if (!userInfo) return;
      const { data: languages, error: langError } = await supabase
        .from("user_info")
        .select("learn_language")
        .eq("id", userInfo.id)
        .single();

      if (langError) throw langError;
      if (languages) {
        setLearnLanguage(languages.learn_language || "");
      }
    };

    fetchLearnLanguage();
  }, [userInfo, supabase]);

  return { learnLanguage };
};

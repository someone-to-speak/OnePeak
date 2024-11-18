import { createClient } from "@/utils/supabase/client";

export const updateMyLanguage = async (userId: string, newLanguage: string) => {
  const supabase = createClient();
  const { error } = await supabase.from("user_info").update({ my_language: newLanguage }).eq("id", userId);

  if (error) {
    console.log("언어 설정 오류:", error.message);
    throw new Error("언어 설정을 저장하는데 문제가 발생했습니다.");
  }
  const updatedLanguage = newLanguage === "korean" ? "english" : newLanguage === "english" ? "korean" : newLanguage;

  // Supabase에서 언어 업데이트
  const { error: learnLangError } = await supabase
    .from("user_info")
    .update({ learn_language: updatedLanguage })
    .eq("id", userId);
  if (learnLangError) {
    console.log("언어 설정 오류:", learnLangError.message);
    throw new Error("언어 설정을 저장하는데 문제가 발생했습니다.");
  }

  return;
};

// export const updateLearnLanguage = async (userId: string, newLanguage: string) => {
//   const supabase = createClient();

//   // Supabase에서 언어 업데이트
//   const { error } = await supabase.from("user_info").update({ learn_language: newLanguage }).eq("id", userId);
//   if (error) {
//     console.log("언어 설정 오류:", error.message);
//     throw new Error("언어 설정을 저장하는데 문제가 발생했습니다.");
//   }

//   return;
// };

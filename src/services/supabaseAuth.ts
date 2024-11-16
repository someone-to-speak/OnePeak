import { createClient } from "@/utils/supabase/client";
import { Provider } from "@supabase/supabase-js";

const redirectTo =
  process.env.NODE_ENV === "production"
    ? process.env.VERCEL_GIT_COMMIT_REF === "main"
      ? "https://onepeak.vercel.app" // main 브랜치
      : process.env.VERCEL_GIT_COMMIT_REF === "dev"
      ? "https://one-peak-dev.vercel.app" // dev 브랜치
      : "https://onepeak.vercel.app"
    : "http://localhost:3000"; // 개발 환경
console.log("NODE_ENV: ", process.env.NODE_ENV);
console.log("VERCEL_GIT_COMMIT_REF: ", process.env.VERCEL_GIT_COMMIT_REF);

export const signInWithProvider = async (provider: Provider) => {
  const supabase = createClient();

  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent"
      }
    }
  });
};

export const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
};

export const getUser = async (): Promise<string> => {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  const {} = await supabase
    .from("user_info")
    .select("*")
    .eq("id", data.user?.id as string);

  return data.user?.user_metadata.name;
};

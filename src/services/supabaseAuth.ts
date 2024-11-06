import { createClient } from "@/utils/supabase/client";
import { Provider } from "@supabase/supabase-js";

export const signInWithProvider = async (provider: Provider) => {
  const supabase = createClient();

  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent"
      },
      // redirectTo: "http://localhost:3000/auth/callback" // 데브 모
      // redirectTo: "https://one-peak-dev.vercel.app/auth/callback" // 배포 모드
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

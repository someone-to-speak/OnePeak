import { createClient } from "@/utils/supabase/client";
import { Provider } from "@supabase/supabase-js";

const redirectTo = process.env.NODE_ENV === "production" ? "https://onepeak.vercel.app" : "http://localhost:3000";

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

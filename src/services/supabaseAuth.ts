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

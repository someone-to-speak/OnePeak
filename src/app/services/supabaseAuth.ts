"use server";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";

import { redirect } from "next/navigation";

export const signInWithProvider = async (provider: Provider) => {
  const supabase = createClient();

  const { data } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      //   queryParams: {
      //     access_type: "offline",
      //     prompt: "consent"
      //   },
      redirectTo: "http://localhost:3000/auth/callback"
    }
  });

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
};

export const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
};

export const getUser = async (): Promise<string> => {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  console.log("get user data: ", data);
  const { data: userData, error } = await supabase.from("user_info").select("*").eq("id", data.user?.id);
  console.log("user data: ", userData);
  console.log("user error: ", error);

  return data.user?.user_metadata.name;
};

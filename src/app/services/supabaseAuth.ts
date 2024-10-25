"use server";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const signInWithProvider = async (provider: Provider) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      //   queryParams: {
      //     access_type: "offline",
      //     prompt: "consent"
      //   },
      // redirectTo: "https://hayfkffvhrshjassogbx.supabase.co/auth/callback"
      redirectTo: "http://localhost:3000/auth/callback"
    }
  });
  console.log("signInWithProvider data", data);
  console.log("signInWithProvider error", error);

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

  const { data, error } = await supabase.auth.getUser();

  console.log("data: ", data);
  console.log("error: ", error);

  return data.user?.user_metadata.name;
};

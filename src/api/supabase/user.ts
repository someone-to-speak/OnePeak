import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getUserId = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user?.id as string;
};

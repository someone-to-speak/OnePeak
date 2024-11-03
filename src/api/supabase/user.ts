import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";

const supabase = createClient();

export const getUserId = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user?.id as string;
};

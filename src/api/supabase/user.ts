import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";

const supabase = createClient();

export const getUserId = async (): Promise<UUID> => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user?.id as UUID;
};

import { getUser } from "@/api/supabase/user";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient();

export const useUser = () => {
  const { data: userInfo } = useQuery({
    queryKey: ["userId"],
    queryFn: () => getUser(),
    staleTime: Infinity
  });

  return { userInfo };
};

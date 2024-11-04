import { getUserId } from "@/api/supabase/user";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient();

export const useUser = () => {
  const { data: userId } = useQuery({
    queryKey: ["userId"],
    queryFn: () => getUserId(),
    staleTime: Infinity
  });

  return { userId };
};

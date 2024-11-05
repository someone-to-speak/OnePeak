import { getUser } from "@/api/supabase/user";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const { data: userInfo } = useQuery({
    queryKey: ["userId"],
    queryFn: () => getUser(),
    staleTime: Infinity
  });

  return { userInfo };
};

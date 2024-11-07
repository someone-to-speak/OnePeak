import { getUser } from "@/api/supabase/user";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser()
  });

  return { userInfo, isLoading };
};

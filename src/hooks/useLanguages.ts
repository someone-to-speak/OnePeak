import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../database.types";

type LanguageType = Tables<"language">;

const fetchLanguages = async (): Promise<LanguageType[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("language").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

export const useLanguages = () => {
  const {
    data = [],
    isLoading,
    error
  } = useQuery<LanguageType[]>({
    queryKey: ["languages"],
    queryFn: fetchLanguages
  });

  return { data, isLoading, error };
};

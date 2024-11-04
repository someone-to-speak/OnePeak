import { downloadFileData } from "@/api/supabase/record";
import { useQuery } from "@tanstack/react-query";

export const useRecord = (type: string, url: string) => {
  const { data: fileData } = useQuery({
    queryKey: ["fileData", url],
    queryFn: () => downloadFileData(url),
    enabled: type === "audio"
  });

  return { fileData };
};

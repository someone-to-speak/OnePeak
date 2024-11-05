import { createClient } from "@/utils/supabase/client";

export const uploadRecording = async (fileBlob: Blob, fileName: string): Promise<string> => {
  const supabase = createClient();
  const { data } = await supabase.storage.from("recordings").upload(fileName, fileBlob, {
    contentType: "audio/webm"
  });

  const {
    data: { publicUrl }
  } = supabase.storage.from("recordings").getPublicUrl(data?.path as string);

  return publicUrl;
};

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const uploadRecording = async (fileBlob: Blob, fileName: string): Promise<string> => {
  const { data } = await supabase.storage.from("recordings").upload(fileName, fileBlob, {
    contentType: "audio/webm"
  });

  const {
    data: { publicUrl }
  } = supabase.storage.from("recordings").getPublicUrl(data?.path as string);

  return publicUrl;
};

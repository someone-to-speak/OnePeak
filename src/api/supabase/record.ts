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

export const downloadFileData = async (url: string) => {
  const { data: fileData, error } = await supabase.storage.from("recordings").download(url);
  console.log("fileData:  ", fileData);
  console.log("error: ", error);
  const audioUrl = URL.createObjectURL(fileData as Blob);
  return audioUrl as string;
};

import { createClient } from "@/utils/supabase/client";

export const uploadRecording = async (fileBlob: Blob, fileName: string) => {
  const supabase = createClient();

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("recordings")
    .upload(fileName, fileBlob, {
      contentType: "audio/webm"
    });
  if (uploadError) console.error("Upload error:", uploadError);
  else console.log("Uploaded successfully:", uploadData);

  const {
    data: { publicUrl }
  } = supabase.storage.from("recordings").getPublicUrl(fileName);
  console.log("publicUrl: ", publicUrl);
  // await supabase.from("recording_metadata").insert([{ room_id: roomId, url: publicUrl }]);
};

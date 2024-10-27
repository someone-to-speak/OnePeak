import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function uploadImage(file: File) {
  const { data, error } = await supabase.storage.from("Profile_url").upload(file.name, file);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function deleteImage(fileName: string) {
  const { data, error } = await supabase.storage
    .from("Profile_url") // 여기에 버킷 이름을 입력
    .remove([fileName]);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

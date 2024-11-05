import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

const checkFileExists = async (fileName: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("Profile_url").list("", { search: fileName });

  if (error) throw error;
  return data && data.length > 0;
};

export const uploadImage = async (file: File) => {
  const supabase = createClient();
  try {
    const fileExtension = file.name.split(".").pop();
    let encodedFileName = `${uuidv4()}.${fileExtension}`;

    const fileExists = await checkFileExists(encodedFileName);
    if (fileExists) {
      encodedFileName = `${uuidv4()}_${encodedFileName}`;
    }

    const { data, error } = await supabase.storage.from("Profile_url").upload(encodedFileName, file);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

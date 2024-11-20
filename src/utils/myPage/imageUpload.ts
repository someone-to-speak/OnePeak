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
    const fileExtension = file.name.split(".").pop(); // 파일 확장자 추출
    let encodedFileName = `${uuidv4()}.${fileExtension}`; // 중복된 파일 처리: 고유한 파일 이름

    const fileExists = await checkFileExists(encodedFileName);
    if (fileExists) {
      encodedFileName = `${uuidv4()}_${encodedFileName}`; // 중복된 파일 이름이 있을 경우, 새로운 UUID를 추가하여 파일 이름 생성
    }

    const { data, error } = await supabase.storage.from("Profile_url").upload(encodedFileName, file);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

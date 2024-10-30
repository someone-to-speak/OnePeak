import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

// 파일 존재 여부 확인 함수
const checkFileExists = async (fileName: string) => {
  const { data, error } = await supabase.storage.from("Profile_url").list("", { search: fileName });

  if (error) throw error;
  return data && data.length > 0; // 파일이 존재하면 true 반환
};

export const uploadImage = async (file: File) => {
  try {
    // 파일 이름을 UUID로 대체하고, 원래 파일의 확장자를 유지
    const fileExtension = file.name.split(".").pop(); // 파일 확장자 추출
    let encodedFileName = `${uuidv4()}.${fileExtension}`;

    // 파일이 이미 존재하는지 확인
    const fileExists = await checkFileExists(encodedFileName);
    if (fileExists) {
      // 중복 파일명이 있으면, 새로운 UUID를 추가하여 고유 이름 보장
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

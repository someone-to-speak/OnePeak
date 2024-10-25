import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/utils/supabase/client"; // Supabase 클라이언트 경로
import { NextResponse } from "next/server";

// Base64 변환 함수
const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  try {
    // Cloudinary에 파일 업로드
    const base64File = await toBase64(file);
    const response = await cloudinary.uploader.upload(base64File, {
      upload_preset: "YOUR_UPLOAD_PRESET"
    });

    // Supabase에 이미지 URL 저장
    const supabase = createClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("유저 오류:", userError);
      return NextResponse.json({ error: "유저 오류" }, { status: 500 });
    }

    if (user) {
      const { error: supabaseError } = await supabase
        .from("profiles")
        .update({ profile_url: response.secure_url })
        .eq("user_id", user.id);

      if (supabaseError) {
        console.error("이미지업로드 실패:", supabaseError);
        throw supabaseError;
      }

      return NextResponse.json({ url: response.secure_url });
    }
  } catch (error) {
    console.error("업로드실패:", error);
    return NextResponse.json({ error: "업로드실패" }, { status: 500 });
  }
}

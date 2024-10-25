import { createClient } from "@/utils/supabase/client";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { imagePublicId } = await req.json(); // 삭제할 이미지의 Public ID

    // Cloudinary에서 이미지 삭제
    await cloudinary.uploader.destroy(imagePublicId);

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
        .update({ profile_url: null })
        .eq("user_id", user.id);

      if (supabaseError) throw supabaseError;

      return NextResponse.json({ message: "프로필 삭제 성공!" });
    }
  } catch (error) {
    console.error("삭제실패:", error);
    return NextResponse.json({ error: "삭제실패" }, { status: 500 });
  }
}

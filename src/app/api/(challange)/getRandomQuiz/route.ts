import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language");
  const type = searchParams.get("type");

  try {
    const { data, error } = await supabase.rpc("get_random_questions", { language, type });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("문제를 찾을 수 없습니다.");

    return NextResponse.json({ questions: data });
  } catch (error) {
    console.error("문제 가져오기 실패:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

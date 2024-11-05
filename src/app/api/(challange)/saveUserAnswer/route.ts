import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(req: Request) {
  const supabase = createClient();
  const { questionId, userId, selectedAnswer } = await req.json();

  if (!questionId || !userId || !selectedAnswer) {
    return NextResponse.json({ error: "모든 필드가 필요합니다." }, { status: 400 });
  }

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("answer")
    .eq("id", questionId)
    .single();

  if (questionError) {
    console.error("문제 가져오기 실패:", questionError);
    return NextResponse.json({ error: questionError.message }, { status: 500 });
  }

  const is_corrected = selectedAnswer === question.answer;
  console.log(is_corrected);

  try {
    const { data, error } = await supabase
      .from("user_answer")
      .insert([
        { question_id: questionId, user_id: userId, selected_answer: selectedAnswer, is_corrected, is_reviewed: false }
      ]);

    if (error) throw new Error(error.message);

    return NextResponse.json({ data });
  } catch (error) {
    console.log({ questionId, userId, selectedAnswer });
    console.error("답안 저장 실패:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

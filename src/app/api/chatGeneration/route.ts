import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// API KEY
const OPEN_AI_KEY = process.env.OPEN_AI_KEY as string;

// open AI 통신
const openai = new OpenAI({
  apiKey: OPEN_AI_KEY
});

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  try {
    const completion = await openai.chat.completions.create({
      messages: message,
      model: "gpt-4o-mini"
    });

    const result = completion.choices[0].message.content;
    console.log(completion.choices[0]);
    return NextResponse.json({ text: result as string });
  } catch (error) {
    console.error("오류 발생:", error);
    return NextResponse.json({ error: "채팅 생성 중 오류 발생" }, { status: 500 });
  }
}

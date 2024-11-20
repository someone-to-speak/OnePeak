import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPEN_AI_KEY as string;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

type ChatMessage = {
  role: "system" | "assistant" | "user";
  content: string;
};

type RequestBody = {
  messages: ChatMessage[];
  situation: string;
  level: number;
  prompt: string;
};

export async function POST(request: NextRequest) {
  try {
    const { messages, situation, level, prompt }: RequestBody = await request.json();
    console.log("prompt", prompt);
    console.log("situation", situation);
    console.log("level", level);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "system",
          content: `
              - 추가 설명 할게
              - 그 중에서 너는 ${level} 난이도로 영어 선생님 역할을 해주면 돼.
              - 상황에 대해서 알려줄게. 상황: ${situation}. `
        },
        ...messages
      ] as ChatMessage[]
    });
    console.log("response", response);
    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error("API 호출 실패:", error);
    return NextResponse.json({ error: "API 호출 중 오류가 발생했습니다." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// API KEY
const WHISPER_API_KEY = process.env.OPEN_AI_KEY2 as string;

// open AI 통신
const whisperai = new OpenAI({
  apiKey: WHISPER_API_KEY
});

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  try {
    // URL에서 webm 파일 다운로드
    const response = await fetch(url);

    const blob = await response.blob();

    const file = new File([blob], "audio.webm", { type: "audio/webm" });

    // // Whisper API에 파일 전송
    const transcription = await whisperai.audio.transcriptions.create({
      file: file,
      model: "whisper-1"
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("오류 발생:", error);
    return NextResponse.json({ error: "파일 변환 중 오류 발생" }, { status: 500 });
  }
}

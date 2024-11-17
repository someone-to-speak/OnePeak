import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// API KEY
const WHISPER_API_KEY = process.env.OPEN_AI_KEY2 as string;

// open AI 통신
const whisperai = new OpenAI({
  apiKey: WHISPER_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    // FormData로 직접 파싱
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "오디오 파일이 없습니다" }, { status: 400 });
    }

    // Whisper API 호출
    const transcription = await whisperai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "ko"
    });
    console.log("API: Whisper API 응답", { text: transcription.text });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("API: 오류 발생:", error);
    return NextResponse.json({ error: "파일 변환 중 오류 발생" }, { status: 500 });
  }
}

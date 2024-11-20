import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// API KEY
const TTS_API_KEY = process.env.OPEN_AI_KEY as string;

// open AI 통신연결
const openai = new OpenAI({
  apiKey: TTS_API_KEY
});

export const POST = async (request: NextRequest) => {
  // 클라이언트로부터 전송된 JSON 데이터를 추출
  const { text } = await request.json();

  // OpenAI TTS(Text-To-Speech) API 호출
  const mp3 = await openai.audio.speech.create({
    model: "tts-1", // 사용할 TTS 모델을 지정
    voice: "nova", // 음성 모델을 지정
    input: text
  });

  // mp3 데이터를 ArrayBuffer 형식으로 가져와 Buffer 객체로 변환
  const buffer = Buffer.from(await mp3.arrayBuffer());

  // 클라이언트에 Base64로 인코딩된 오디오 데이터를 응답
  return NextResponse.json({ buffer: buffer.toString("base64") });
};

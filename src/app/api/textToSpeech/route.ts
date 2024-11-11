import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// API KEY
const TTS_API_KEY = process.env.OPEN_AI_KEY as string;

// open AI 통신연결
const openai = new OpenAI({
  apiKey: TTS_API_KEY
});

// // 현재 디렉토리에서 "speech.mp3" 파일의 절대 경로를 생성
// const speechFile = path.resolve("./speech.mp3");

export const POST = async (reqeust: NextRequest) => {
  const { text } = await reqeust.json();

  const mp3 = await openai.audio.speech.create({
    model: "tts-1", // 사용할 TTS 모델을 지정
    voice: "nova", // 음성 모델을 지정
    input: text
  });

  //   // 생성된 음성 파일의 경로를 콘솔에 출력
  //   console.log(speechFile);

  // mp3 데이터를 ArrayBuffer 형식으로 가져와, Buffer 객체로 변환
  const buffer = Buffer.from(await mp3.arrayBuffer());

  //   // 변환된 Buffer 데이터를 "speech.mp3" 파일에 저장
  //   await fs.promises.writeFile(speechFile, buffer);
  return NextResponse.json({ buffer: buffer.toString("base64") });
};

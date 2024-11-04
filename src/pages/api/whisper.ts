import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false // 파일 업로드를 위해 기본 bodyParser 비활성화
  }
};

// API KEY
const WHISPER_API_KEY = process.env.OPEN_AI_KEY2 as string;

// open AI 통신
const whisperai = new OpenAI({
  apiKey: WHISPER_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Mehod not allowed" });
  }

  console.log("API 호출 시작!");

  try {
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024 // 25MB
    });
    const [_, files] = await form.parse(req);
    const audioFile = files.audio?.[0];

    if (!audioFile) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    // 파일 내용 확인
    const fileContent = fs.readFileSync(audioFile.filepath);
    console.log("File size:", fileContent.length);
    console.log("First few bytes:", fileContent.slice(0, 20)); // 파일의 처음 부분 확인

    // 파일이 비어있는지 확인
    if (fileContent.length === 0) {
      return res.status(400).json({ error: "Empty file received" });
    }

    // 임시 파일로 저장해보기
    const tempPath = `./temp-${Date.now()}.webm`;
    fs.writeFileSync(tempPath, fileContent);

    console.log("파일 저장됨:", tempPath);

    // Whisper API 호출
    const transcription = await whisperai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-1",
      language: "ko"
    });

    // 임시 파일들 삭제
    fs.unlinkSync(audioFile.filepath);
    fs.unlinkSync(tempPath);

    return res.status(200).json({ text: transcription.text });
  } catch (error: any) {
    console.error("상세 에러 정보:", {
      message: error.message,
      name: error.name,
      status: error.status,
      stack: error.stack,
      response: error.response?.data // OpenAI API 에러 응답
    });

    // 에러 타입에 따른 구체적인 메시지
    let errorMessage = "Unknown error";
    if (error.message.includes("Unrecognized file format")) {
      errorMessage = "파일 형식이 인식되지 않습니다. webm, mp3, wav 등의 형식을 사용해주세요.";
    } else if (error.message.includes("File is empty")) {
      errorMessage = "빈 파일이 전송되었습니다.";
    }

    return res.status(500).json({
      error: "Failed to process audio",
      details: errorMessage,
      originalError: error.message
    });
  }
}

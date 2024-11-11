import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import os from "os";

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
  if (req.method === "POST") {
    try {
      const form = formidable({
        maxFileSize: 25 * 1024 * 1024 // 25MB
      });
      const [filed, files] = await form.parse(req);
      const audioFile = files.audio?.[0];
      console.log("filed", filed); // build 오류 임시 해결
      console.log("files", files); // 디버깅용

      if (!audioFile) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      // 파일 내용 확인
      const fileContent = fs.readFileSync(audioFile.filepath);
      console.log("fileContent", fileContent); // 디버깅용

      // 파일이 비어있는지 확인
      if (fileContent.length === 0) {
        return res.status(400).json({ error: "Empty file received" });
      }

      // 임시 파일로 저장해보기

      const tempPath = `${os.tmpdir()}/temp-${Date.now()}.webm`;
      fs.writeFileSync(tempPath, fileContent);

      console.log("tempPath", tempPath); // 디버깅용

      // Whisper API 호출
      const transcription = await whisperai.audio.transcriptions.create({
        file: fs.createReadStream(tempPath),
        model: "whisper-1",
        language: "ko"
      });
      console.log("transcription", transcription); // 디버깅용

      // 임시 파일들 삭제
      fs.unlinkSync(audioFile.filepath);
      fs.unlinkSync(tempPath);

      return res.status(200).json({ text: transcription.text });
    } catch (error) {
      console.error("API 호출 실패:", error);
      return res.status(500).json({ error: "API 호출 중 오류가 발생했습니다." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

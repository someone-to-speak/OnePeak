import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { Message } from "@/app/types/chatBotType/chatBotType";

// API KEY
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPEN_AI_KEY as string;

// open AI 통신
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const messages: Message[] = req.body.messages;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // 모델명
        messages: [
          {
            role: "system",
            content: "나의 영어 선생님이 되어줘"
          },
          ...messages
        ]
      });

      res.status(200).json({ content: response.choices[0].message.content });
    } catch (error) {
      console.log("API 호출 실패: ", error);
      res.status(500).json({ error: "API 호출 중 오류가 발생했습니다." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

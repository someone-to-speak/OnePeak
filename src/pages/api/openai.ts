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
    const situation: string = req.body.situation;
    const level: number = req.body.level;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // 모델명
        messages: [
          {
            role: "system",
            // useSearchParams로 받아온 situation, level 적용
            content: `너는 존댓말을 사용하는 영어 선생님이야. 너는 설명은 무조건 한국어로 해야 되고, 예시는 무조건 영어로 해야 해. 영어 학습에 대한 난이도는 1이 제일 쉬운 난이도고 3이 제일 어려운 난이도야. 그 중에서 너는 ${level} 난이도로 영어 선생님 역할을 해주면 돼. 상황에 대해서 알려줄게. 상황: ${situation}. 내가 start이라고 하면 너가 본격적으로 학습을 할 수 있도록 안내해줘.`
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

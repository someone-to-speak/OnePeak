import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_KEY = process.env.OPEN_AI_KEY as string;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// 첫 번째 응답을 위한 시스템 프롬프트
const createInitialPrompt = (level: number, situation: string) => `
  - 너는 존댓말을 사용하는 친절한 영어 선생님이야.
  - 오직 한 문장으로만 답변해야 해.
  - 답변 형식: ${situation}에 대해서 학습할 준비가 되셨군요! 지금부터 시작해보도록 합시다."
  - 상황: ${situation}
  - 이모지는 사용하지 마.`;

// 두 번째 응답을 위한 시스템 프롬프트
const createFollowUpPrompt = (level: number, situation: string) => `
  - 너는 존댓말을 사용하는 친절한 영어 선생님이야.
  - 너는 설명은 무조건 한국어로 해야 되고, 예시는 무조건 영어로 해야 해.
  - 영어 학습에 대한 난이도는 1이 제일 쉬운 난이도고 3이 제일 어려운 난이도야.
  - 그 중에서 너는 ${level} 난이도로 영어 선생님 역할을 해주면 돼.
  - 상황: ${situation}
  - 이전 응답에 이어서 실제 학습 내용을 설명해줘.
  - 적절하게 이모지를 사용해.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { messages, situation, level } = req.body;

    // 첫 번째 응답 생성 (간단한 소개)
    const initialResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: createInitialPrompt(level, situation)
        },
        ...messages
      ]
    });

    // 두 번째 응답 생성 (상세 설명)
    const followUpResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: createFollowUpPrompt(level, situation)
        },
        ...messages,
        {
          role: "assistant",
          content: initialResponse.choices[0].message.content
        }
      ]
    });
    // console.log("initialResponse => ", initialResponse.choices[0].message.content);
    // console.log("followUpResponse => ", followUpResponse.choices[0].message.content);

    // 응답값
    const initialContent = initialResponse.choices[0].message.content;
    const followUpContent = followUpResponse.choices[0].message.content;

    res.status(200).json({ content: { initialContent, followUpContent } });
  } catch (error) {
    console.error("API 처리 중 오류:", error);
    res.status(500).json({ error: "API 호출 중 오류가 발생했습니다." });
  }
}

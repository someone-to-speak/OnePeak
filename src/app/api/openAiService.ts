import OpenAI from "openai";
import { Message } from "../types/chatBotType/chatBotType";

// API KEY
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPEN_AI_KEY as string;

// open AI 통신
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export async function getChatResponse(chatHistory: any): Promise<Message> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 모델명
      messages: chatHistory
    });
    console.log("응답", response);

    return {
      role: "system",
      content: response.choices[0].message.content
    };
  } catch (error) {
    console.log("API와 통신 실패 => ", error);
    throw error;
  }
}

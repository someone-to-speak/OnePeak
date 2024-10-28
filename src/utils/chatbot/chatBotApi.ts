import { Message } from "@/app/types/chatBotType/chatBotType";

export const getChatResponse = async (messages: Message[], situation: string, level: number) => {
  try {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages, situation, level }) // messages 배열을 JSON으로 변환
      // next: {
      //   revalidate: 86400 // 하루
      // }
    });

    if (!response.ok) {
      throw new Error("API 호출 실패");
    }

    const data = await response.json();
    return data.content; // 챗봇의 응답
  } catch (error) {
    console.log("API와 통신 실패: ", error);
  }
};

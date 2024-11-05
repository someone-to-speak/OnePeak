import { Message } from "@/app/types/chatBotType/chatBotType";

export const getChatResponse = async (
  messages: Message[],
  situation: string,
  level: number,
  myLanguage: string,
  learnLanguage: string
) => {
  try {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages, situation, level, myLanguage, learnLanguage }), // messages 배열을 JSON으로 변환
      next: {
        revalidate: 86400000 // 하루
      }
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

// 소리를 텍스트로 변환
export const convertSpeechToText = async (audioFile: File) => {
  try {
    const formData = new FormData();

    const blob = new Blob([await audioFile.arrayBuffer()], { type: "audio/webm" });
    formData.append("audio", blob, "audio.webm");

    console.log("전송할 파일 정보:", {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size
    });

    const response = await fetch("/api/whisper", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error("음성 변환 실패");
    }

    console.log("API Response:", data);
    return data.text;
  } catch (error) {
    console.log("음성 변환 중 오류: ", error);
    throw error;
  }
};

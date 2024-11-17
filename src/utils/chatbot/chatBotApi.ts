import { Message } from "@/app/types/chatBotType/chatBotType";

export const getChatResponse = async (messages: Message[], situation: string, level: number) => {
  try {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages, situation, level }), // messages 배열을 JSON으로 변환
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

// 소리를 텍스트로 전환
export const convertSpeechToText = async (audioFile: File) => {
  try {
    console.log("A. convertSpeechToText 시작");

    const formData = new FormData();

    // 원본 파일의 타입을 유지
    const blob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });

    // 파일 확장자 원본 타입에 맞게 설정
    const fileExtension = audioFile.type.includes("wav") ? "wav" : "webm";

    formData.append("audio", blob, `audio.${fileExtension}`);

    console.log("B. FormData 생성 완료", {
      blobSize: blob.size,
      blobType: blob.type
    });

    console.log("C. API 호출 시도");

    try {
      const response = await fetch("/api/chatBotSpeechToText", {
        method: "POST",
        body: formData
      });

      console.log("D. fetch 응답 받음:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const data = await response.json();
      console.log("E. 응답 데이터:", data);

      if (!response.ok) {
        console.error("F. API 에러:", data);
        throw new Error(data.error || "음성 변환 실패");
      }

      console.log("G. 변환 성공:", data.text);
      return data.text;
    } catch (error) {
      if (error instanceof Error) {
        console.error("fetch 또는 JSON 파싱 실패:", error.message);
        throw error;
      }
      throw new Error("API 호출 중 오류 발생");
    }
  } catch (error) {
    console.error("H. 최종 에러:", error);
    throw error;
  }
};

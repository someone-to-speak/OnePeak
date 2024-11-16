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
    const blob = new Blob([await audioFile.arrayBuffer()], { type: "audio/webm" });
    formData.append("audio", blob, "audio.webm");

    console.log("B. FormData 생성 완료", {
      blobSize: blob.size,
      blobType: blob.type
    });

    console.log("C. API 호출 시도");

    // fetch를 try-catch로 감싸서 네트워크 에러 확인
    let response;
    try {
      response = await fetch("/api/chatBotWhisper", {
        method: "POST",
        body: formData
      });
      console.log("D. fetch 응답 받음:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
    } catch (fetchError) {
      console.error("fetch 실패:", fetchError);
      throw new Error("API 호출 실패");
    }

    // response.json() 호출을 try-catch로 감싸서 JSON 파싱 에러 확인
    let data;
    try {
      data = await response.json();
      console.log("E. 응답 데이터:", data);
    } catch (jsonError) {
      console.error("JSON 파싱 실패:", jsonError);
      throw new Error("응답 데이터 처리 실패");
    }

    if (!response.ok) {
      console.error("F. API 에러:", data);
      throw new Error(data.error || "음성 변환 실패");
    }

    console.log("G. 변환 성공:", data.text);
    return data.text;
  } catch (error) {
    console.error("H. 최종 에러:", error);
    throw error;
  }
};

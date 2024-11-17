import { Message } from "@/app/types/chatBotType/chatBotType";
import { getChatResponse } from "@/utils/chatbot/chatBotApi";
import { useCallback, useState } from "react";

export const useChatMessages = (situation: string, level: number) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: `안녕하세요! ${situation}에 대해 학습하러 오셨군요? 준비가 되셨다면 start라고 입력해주세요.`
    }
  ]);

  const sendMessage = useCallback(
    async (content: string) => {
      try {
        // 사용자 메세지 추가
        const userMessage: Message = {
          role: "user",
          content
        };

        // 함수형 업데이트를 사용하여 최신 상태 보장
        setMessages((prev) => {
          const updatedMessages = [...prev, userMessage];

          // 챗봇의 응답 가져오기
          getChatResponse(updatedMessages, situation, level)
            .then((botResponse) => {
              if (botResponse) {
                const botMessage: Message = {
                  role: "assistant",
                  content: botResponse
                };
                // 챗봇 메세지 추가
                setMessages((currentMessages) => [...currentMessages, botMessage]);
              }
            })
            .catch((error) => {
              console.log("챗봇 응답 실패: ", error);
              throw error;
            });

          return updatedMessages;
        });
      } catch (error) {
        console.log("메시지 처리 실패: ", error);
        throw error;
      }
    },
    [situation, level]
  );

  return { messages, sendMessage };
};

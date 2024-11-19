import { Message } from "@/app/types/chatBotType/chatBotType";
import { getChatResponse } from "@/utils/chatbot/chatBotApi";
import { useCallback, useState } from "react";

const createTimestamp = () => {
  const now = new Date();
  return `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

export const useChatMessages = (situation: string, level: number) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: `안녕하세요! ${situation}에 대해 학습하러 오셨군요? 준비가 되셨다면 start라고 입력해주세요.`,
      timestamp: createTimestamp()
    }
  ]);

  const sendMessage = useCallback(
    async (content: string) => {
      try {
        const userMessage: Message = {
          role: "user",
          content,
          timestamp: createTimestamp()
        };

        setMessages((prev) => {
          const updatedMessages = [...prev, userMessage];

          getChatResponse(updatedMessages, situation, level)
            .then((botResponse) => {
              if (botResponse) {
                const botMessage: Message = {
                  role: "assistant",
                  content: botResponse,
                  timestamp: createTimestamp()
                };
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

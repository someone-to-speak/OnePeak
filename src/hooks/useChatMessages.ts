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
      // 사용자 메세지 추가
      const userMessage: Message = {
        role: "user",
        content
      };
      setMessages((prev) => [...prev, userMessage]);
      try {
        // 챗봇의 응답 가져오기
        const botResponse = await getChatResponse([...messages, userMessage], situation, level);

        if (botResponse) {
          // const botMessage: Message = { role: "assistant", content: botResponse };
          const initialContentMessage: Message = { role: "assistant", content: botResponse.initialContent };
          const followUpContentMessage: Message = { role: "assistant", content: botResponse.followUpContent };
          // 챗봇 메세지 추가
          // setMessages((prev) => [...prev, botMessage]);
          setMessages((prev) => [...prev, initialContentMessage, followUpContentMessage]);
        }
      } catch (error) {
        console.log("챗봇 응답 실패: ", error);
        throw error;
      }
    },
    [messages, situation, level]
  );

  return { messages, sendMessage };
};

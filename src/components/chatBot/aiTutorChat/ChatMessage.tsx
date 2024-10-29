"use client";

import { Message } from "@/app/types/chatBotType/chatBotType";
import { getChatResponse } from "@/utils/chatbot/chatBotApi";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ChatMessage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  // 선택한 "오늘의 학습" 데이터 받아오기
  const searchParams = useSearchParams();
  const situation = searchParams?.get("situation") as string;
  const level = Number(searchParams?.get("level"));

  // 챗봇과 대화하기
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 사용자 메세지 추가
    const userMessage: Message = {
      role: "user",
      content: userInput
    };

    const newMessages: Message[] = [...messages, userMessage];

    setMessages(newMessages);
    setUserInput("");

    // 챗봇의 응답 가져오기
    if (situation && level !== undefined) {
      const botResponse = await getChatResponse(newMessages, situation, level);

      if (botResponse) {
        const botMessage: Message = { role: "assistant", content: botResponse };

        // 챗봇 메세지 추가
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-full mx-auto bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4 mb-16">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role}>
            <strong>{msg.role === "user" ? "나" : "챗봇"}</strong>
            <div className="border border-spacing-10 text-green-500 p-5">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="overflow-y-auto"></div>
      <div></div>
      <form className="sticky bottom-[55px] flex w-full bg-gray-200 p-4" onSubmit={sendMessage}>
        <input
          className="flex-grow p-2 rounded border border-gray-400"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="메세지를 입력해주세요."
        />
        <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded" type="submit">
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatMessage;

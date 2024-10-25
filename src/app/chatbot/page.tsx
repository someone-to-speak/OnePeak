"use client";

import { useState } from "react";
import { getChatResponse } from "../api/openAiService";
import { Message } from "../types/chatBotType/chatBotType";

const page = () => {
  const [userMessage, setUserMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    // 사용자가 보낸 메세지를 채팅 기록에 추가
    const newUserMessage: Message = {
      role: "user",
      content: userMessage
    };

    setChatHistory((prev) => [...prev, newUserMessage]);

    // API 통신
    try {
      // AI 응답 받아오기
      const aiResponse = await getChatResponse([...chatHistory, newUserMessage]);
      setChatHistory((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.log("AI 응답 오류 => ", error);
    }
  };

  return (
    <div className="w-full flex flex-col h-screen shadow-md">
      <div className="flex-grow"></div>
      <div className="w-full flex items-center justify-between p-5" style={{ marginBottom: "55px" }}>
        <form className="w-full flex justify-between p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300">
          <input className="w-4/5" placeholder="질문을 입력해주세요." value={userMessage} />
          <button className="p-4 text-sm text-white bg-blue-500 rounded-lg">전송</button>
        </form>
      </div>
    </div>
  );
};

export default page;

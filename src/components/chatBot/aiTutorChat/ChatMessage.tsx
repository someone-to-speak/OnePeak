"use client";

import { Message } from "@/app/types/chatBotType/chatBotType";
import { getChatResponse } from "@/utils/chatbot/chatBotApi";
import { useState } from "react";

const ChatMessage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");

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
    const botResponse = await getChatResponse(newMessages);

    if (botResponse) {
      const botMessage: Message = { role: "assistant", content: botResponse };

      // 챗봇 메세지 추가
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.role}>
            <strong>{msg.role === "user" ? "나: " : "챗봇: "}</strong>
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="메세지를 입력해주세요."
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

export default ChatMessage;

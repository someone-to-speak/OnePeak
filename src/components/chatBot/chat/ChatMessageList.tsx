import { Message } from "@/app/types/chatBotType/chatBotType";
import React from "react";

type ChatMessageListProps = {
  messages: Message[];
};

const ChatMessageList = ({ messages }: ChatMessageListProps) => {
  // 줄바꿈 문자를 JSX 엘리먼트로 변환하는 함수
  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`
              relative p-4 rounded-2xl shadow-sm
              max-w-[80%] 
              ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white border border-gray-200 rounded-bl-none"
              }
            `}
          >
            <div
              className={`
              text-xs mb-1 font-medium
              ${message.role === "user" ? "text-blue-100" : "text-gray-500"}
            `}
            >
              {message.role === "user" ? "나" : "챗봇"}
            </div>
            <div
              className={`
              text-sm leading-relaxed whitespace-pre-wrap
              ${message.role === "user" ? "text-white" : "text-gray-700"}
            `}
            >
              {formatMessage(message.content)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessageList;

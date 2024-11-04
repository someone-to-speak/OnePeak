import { Message } from "@/app/types/chatBotType/chatBotType";
import React from "react";

type ChatMessageListProps = {
  messages: Message[];
};
const ChatMessageList = ({ messages }: ChatMessageListProps) => {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg ${
            message.role === "user" ? "bg-blue-100 ml-auto max-w-[80%]" : "bg-gray-100 mr-auto max-w-[80%]"
          }`}
        >
          <div className="font-semibold mb-1">{message.role === "user" ? "나" : "챗봇"}</div>
          <div className="text-gray-800 break-words">{message.content}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessageList;

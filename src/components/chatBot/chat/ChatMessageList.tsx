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
    <div className="space-y-3 max-w-3xl mx-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} items-start gap-2`}
        >
          {/* user가 아닌 경우 앱아이콘 노출 */}
          {message.role !== "user" && (
            <div className="w-[30px] h-[30px] bg-primary-900 font-medium rounded-[25px] flex items-center justify-center">
              <img src="/images/MainIcon.svg" alt="이미지" className="w-6 h-[26px]" />
            </div>
          )}
          {/* 말풍선 */}
          <div
            className={`
            relative py-2 px-3 rounded-2xl shadow-sm
            max-w-[214px] text-justify text-sm mx-3
            ${message.role === "user" ? "bg-primary-800 text-black rounded-br-none " : "bg-gray-900 rounded-tl-none"}
          `}
          >
            <div
              className={`
            text-sm leading-relaxed whitespace-pre-wrap text-black
            ${message.role}
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

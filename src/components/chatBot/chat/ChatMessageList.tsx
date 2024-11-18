"use client";

import { Message } from "@/app/types/chatBotType/chatBotType";
import React, { useEffect, useRef } from "react";
import mainIcon from "@/assets/main-icon.svg";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";

type ChatMessageListProps = {
  messages: Message[];
};

const ChatMessageList = ({ messages }: ChatMessageListProps) => {
  // 스크롤 관련 ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 줄바꿈 문자를 JSX 엘리먼트로 변환하는 함수
  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        <Typography size={12} weight={"normal"} className="md:text-[16px]">
          {line}
        </Typography>
        {i !== content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="space-y-3 mx-auto mt-[10px] md:mt-[70px]">
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} items-start`}>
          {/* user가 아닌 경우 앱아이콘 노출 */}
          {message.role !== "user" && (
            <div className="w-[30px] h-[30px] bg-primary-900 font-medium rounded-[25px] flex items-center justify-center mr-[6px]">
              <Image src={mainIcon} alt="메인아이콘" width={20} height={20} />
            </div>
          )}
          {/* 말풍선 */}
          <div
            className={`
            relative py-2 px-3 rounded-2xl shadow-sm
            max-w-[214px] md:max-w-[354px] text-justify text-sm
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

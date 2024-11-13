"use client";

import { useUser } from "@/hooks/useUser";
import MyChat from "./MyChat";
import OtherChat from "./OhterChat";
import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { useRef, useEffect } from "react";

export const MessageList = ({ messages }: { messages: MessageWithUserInfo[] | undefined }) => {
  const { userInfo } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when the component mounts or when `messages` change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex flex-col flex-grow mb-[80px] gap-3 md:gap-5 overflow-scroll">
      {messages?.map((msg) =>
        msg.sender_id.id === userInfo?.id ? (
          <MyChat key={msg.id} message={msg} />
        ) : (
          <OtherChat key={msg.id} message={msg} />
        )
      )}
    </div>
  );
};

export default MessageList;

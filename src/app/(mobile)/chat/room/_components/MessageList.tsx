"use client";

import { useUser } from "@/hooks/useUser";
import MyChat from "./MyChat";
import OtherChat from "./OhterChat";
import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { useRef, useEffect } from "react";
import { useScreenSizeStore } from "@/shared/StoreProvider";

export const MessageList = ({ messages }: { messages: MessageWithUserInfo[] | undefined }) => {
  const { userInfo } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

  useEffect(() => {
    // Scroll to the bottom when the component mounts or when `messages` change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [isLargeScreen, messages]);

  return (
    <div ref={containerRef} className="flex px-4 md:px-3 flex-col flex-grow mb-[70px] gap-3 md:gap-5 overflow-scroll">
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

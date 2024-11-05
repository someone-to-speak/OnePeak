"use client";

import { useMessage } from "@/hooks/useMessage";
import { useUser } from "@/hooks/useUser";
import { UUID } from "crypto";
import MyChat from "./MyChat";
import OtherChat from "./OhterChat";

export const MessageList = ({ conversationId }: { conversationId: UUID }) => {
  const { userInfo } = useUser();
  const { messages, isLoading, isError } = useMessage(conversationId);

  if (isLoading) {
    return <div>잠시만 기다려주세요...</div>;
  }

  if (isError) {
    return <div>에러가 발생...</div>;
  }

  return (
    <div className="w-full">
      {messages?.map((msg) =>
        msg.sender_id === userInfo?.id ? (
          <MyChat key={msg.id} message={msg} />
        ) : (
          <OtherChat key={msg.id} message={msg} />
        )
      )}
    </div>
  );
};

export default MessageList;

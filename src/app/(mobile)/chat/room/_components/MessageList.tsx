"use client";

import { useUser } from "@/hooks/useUser";
import MyChat from "./MyChat";
import OtherChat from "./OhterChat";
import { MessageWithUserInfo } from "@/types/chatType/chatType";

export const MessageList = ({ messages }: { messages: MessageWithUserInfo[] | undefined }) => {
  const { userInfo } = useUser();

  return (
    <div className="w-full flex flex-col my-0 flex-grow gap-3">
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

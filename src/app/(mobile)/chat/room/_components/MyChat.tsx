"use client";

import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { useState } from "react";
import Coaching from "./Coaching";

const MyChat = ({ message }: { message: MessageWithUserInfo }) => {
  const [isCoaching, setIsCoaching] = useState<boolean>(false);

  return (
    <div className="w-full h-auto flex pt-2 px-3 rounded-2xl justify-end">
      {message.type === "audio" ? (
        <div className="flex flex-col gap-1">
          <audio controls src={message.content} />
          {!isCoaching ? <button onClick={() => setIsCoaching(true)}>AI 코칭</button> : <Coaching message={message} />}
        </div>
      ) : (
        <div>텍스트</div>
      )}
    </div>
  );
};

export default MyChat;

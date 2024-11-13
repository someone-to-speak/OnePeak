"use client";

import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { useState } from "react";
import Coaching from "./Coaching";
import CustomAudio from "@/components/audio/Audio";
import MyChatCard from "@/components/ui/chat/myChat/MyChatCard";
import { Typography } from "@/components/ui/typography";
import { formatDate } from "@/utils/formatting/format";

const MyChat = ({ message }: { message: MessageWithUserInfo }) => {
  const [isCoaching, setIsCoaching] = useState<boolean>(false);

  return (
    <div className="flex justify-end">
      <div className="flex items-end">
        <Typography size={10} className="font-medium text-[#8C8C8C] p-1 md:text-[14px]">
          {formatDate(message.created_at)}
        </Typography>
        {message.type === "audio" ? (
          <div className="flex flex-col gap-1 items-end bg-white">
            <CustomAudio url={message.content} isOwned={true} />
            {!isCoaching ? (
              <button onClick={() => setIsCoaching(true)} className="flex justify-end">
                <Typography size={12} className="py-1 px-2 bg-secondary-900 rounded-[10px] md:text-[14px]">
                  AI 코칭
                </Typography>
              </button>
            ) : (
              <Coaching message={message.content} />
            )}
          </div>
        ) : (
          <MyChatCard message={message} />
        )}
      </div>
    </div>
  );
};

export default MyChat;

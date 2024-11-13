import CustomAudio from "@/components/audio/Audio";
import OtherChatCard from "@/components/ui/chat/otherChat/OtherChatCard";
import { Typography } from "@/components/ui/typography";
import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { formatDate } from "@/utils/formatting/format";
import Image from "next/image";

const OtherChat = ({ message }: { message: MessageWithUserInfo }) => {
  return (
    <div className="flex gap-[6px]">
      <Image
        src={message.sender_id.profile_url}
        alt={""}
        width={30}
        height={30}
        className="w-[30px] h-[30px] rounded-full"
      />
      <div className="flex items-end">
        <div>
          {message.type === "audio" ? (
            <CustomAudio url={message.content} isOwned={false} />
          ) : (
            <OtherChatCard message={message} />
          )}
        </div>
        <Typography size={10} className="font-medium text-[#8C8C8C] p-1 md:text-[14px]">
          {formatDate(message.created_at)}
        </Typography>
      </div>
    </div>
  );
};

export default OtherChat;

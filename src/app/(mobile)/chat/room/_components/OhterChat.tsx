import CustomAudio from "@/components/audio/Audio";
import OtherChatCard from "@/components/ui/chat/otherChat/OtherChatCard";
import { MessageWithUserInfo } from "@/types/chatType/chatType";
import Image from "next/image";

const OtherChat = ({ message }: { message: MessageWithUserInfo }) => {
  return (
    <div className="w-full h-auto flex gap-[6px]">
      <Image src={message.sender_id.profile_url} alt={""} width={30} height={30} className="rounded-full" />
      <div>
        {message.type === "audio" ? <CustomAudio url={message.content} /> : <OtherChatCard message={message} />}
      </div>
    </div>
  );
};

export default OtherChat;

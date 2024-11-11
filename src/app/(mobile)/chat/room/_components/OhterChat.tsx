import CustomAudio from "@/components/audio/Audio";
import { MessageWithUserInfo } from "@/types/chatType/chatType";
import Image from "next/image";

const OtherChat = ({ message }: { message: MessageWithUserInfo }) => {
  return (
    <div className="w-full h-auto flex gap-[6px]">
      <Image src={message.sender_id.profile_url} alt={""} width={25} height={25} className="rounded-[25px]" />
      <div>{message.type === "audio" ? <CustomAudio url={message.content} /> : <div>텍스트</div>}</div>
    </div>
  );
};

export default OtherChat;

import { MessageWithUserInfo } from "@/types/chatType/chatType";

const OtherChat = ({ message }: { message: MessageWithUserInfo }) => {
  return (
    <div className="w-full h-auto pt-2 px-3 rounded-2xl">
      {message.type === "audio" ? <audio controls src={message.content} /> : <div>텍스트</div>}
    </div>
  );
};

export default OtherChat;

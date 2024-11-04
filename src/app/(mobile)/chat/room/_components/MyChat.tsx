import { useRecord } from "@/hooks/useRecord";
import { MessageWithUserInfo } from "@/types/chatType/chatType";

const MyChat = ({ message }: { message: MessageWithUserInfo }) => {
  const { fileData } = useRecord(message.type, message.content);

  return (
    <div className="w-full h-auto pt-2 px-3 rounded-2xl">
      {fileData ? <audio controls src={message.content} /> : <div>텍스트</div>}
    </div>
  );
};

export default MyChat;

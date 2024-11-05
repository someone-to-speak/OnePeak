import { ConversationWithParticipants } from "@/types/chatType/chatType";
import Image from "next/image";
import DotsThree from "@/assets/DotsThree.svg";

export const Chat = ({ conversation }: { conversation: ConversationWithParticipants }) => {
  console.log("conversation: ", conversation.last_message);
  return (
    <div className="w-full h-auto flex gap-[10px] items-center p-3 border-[1px] border-solid border-black rounded-[20px]">
      <Image
        className="rounded-[20px]"
        src={conversation.participants?.user_info.profile_url as string}
        alt={"profile"}
        width={62}
        height={62}
      />
      <div className="w-full flex flex-col gap-[2px]">
        <div className="flex justify-between items-center">
          <Image
            className="rounded-[5px]"
            src={conversation.participants?.user_info.my_language?.language_img_url as string}
            alt={"country"}
            width={14}
            height={14}
          />
          <Image src={DotsThree} alt={""} />
        </div>
        {/* <p>{conversation.last_message.type}</p> */}
        <div></div>
      </div>
    </div>
  );
};

export default Chat;

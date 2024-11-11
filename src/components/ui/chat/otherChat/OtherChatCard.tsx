import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { Typography } from "@/components/ui/typography";

const OtherChatCard = ({ message }: { message: MessageWithUserInfo }) => {
  return (
    <div className="max-w-[214px] py-2 px-3 bg-gray-900 rounded-2xl shadow-sm rounded-tl-none">
      <Typography size={12} className="font-medium">
        {message.content}
      </Typography>
    </div>
  );
};

export default OtherChatCard;

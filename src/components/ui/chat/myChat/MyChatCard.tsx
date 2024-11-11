import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { Typography } from "@/components/ui/typography";

const MyChatCard = ({ message }: { message: MessageWithUserInfo }) => {
  return (
    <div className="max-w-[214px] py-2 px-3 bg-primary-800 rounded-2xl shadow-sm rounded-br-none">
      <Typography size={12} className="font-medium">
        {message.content}
      </Typography>
    </div>
  );
};

export default MyChatCard;

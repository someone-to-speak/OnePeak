import Image from "next/image";
import stamp from "@/assets/stamp.svg";
import { Typography } from "@/components/ui/typography";
import useNotifications from "@/hooks/useNotifications";
import LoadingSpinner from "../ui/LoadingSpinner";

const NotificationPopup = () => {
  const { notifi } = useNotifications();

  return (
    <div className="absolute right-0 mt-2 w-[375px] h-[330px] bg-[#FDFDFD] rounded-[4px] shadow-2xl z-10 overflow-auto hover:overflow-scroll cursor-default">
      {notifi && notifi.length > 0 ? (
        notifi
          .slice()
          .reverse()
          .map((noti) => (
            <div key={noti.id} className="flex flex-col border-b border-gray-800 py-[20px] px-4">
              <div className="flex flex-row justify-between items-center mb-[4px]">
                <div className="flex flex-row gap-[8px]">
                  <Image src={stamp} alt="Stamp" width={16} height={16} />
                  <Typography size={16} weight="bold" className="w-[220px] truncate">
                    {noti.title}
                  </Typography>
                </div>
                <Typography size={14} weight="medium" className="text-gray-600 text-left">
                  {new Date(noti.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                </Typography>
              </div>
              <Typography size={14} weight="medium" className="break-words">
                {noti.message}
              </Typography>
            </div>
          ))
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default NotificationPopup;

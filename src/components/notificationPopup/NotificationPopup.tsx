import Image from "next/image";
import stamp from "@/assets/stamp.svg";
import { Typography } from "@/components/ui/typography";
import useNotifications from "@/hooks/useNotifications";
import { Spinner } from "@nextui-org/react";

const NotificationPopup = () => {
  const { notifi } = useNotifications();

  return (
    <div className="absolute right-0 mt-2 w-[375px] h-[330px] bg-[#FDFDFD] shadow-2xl z-10 overflow-auto hover:overflow-scroll cursor-default">
      {notifi && notifi.length > 0 ? (
        notifi
          .slice()
          .reverse()
          .map((noti) => (
            <div key={noti.id} className="flex flex-col border-b border-gray-800 py-[20px] px-4">
              <div className="flex flex-row justify-between items-center">
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
              <Typography size={14} weight="medium" className="break-words line-clamp-1 hover:line-clamp-none">
                {noti.message}
              </Typography>
            </div>
          ))
      ) : (
        <div className="w-[375px] h-[330px] flex items-center justify-center">
          <Spinner label="로딩중" color="success" />
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;
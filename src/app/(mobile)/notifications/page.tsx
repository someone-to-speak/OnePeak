"use client";

import Image from "next/image";
import stamp from "@/assets/stamp.svg";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { Typography } from "@/components/ui/typography";
import useNotifications from "@/hooks/useNotifications";
import { useUser } from "@/hooks/useUser";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const NotificationPage = () => {
  const { notifi } = useNotifications();
  const { userInfo, isLoading } = useUser();

  if (isLoading) return <LoadingSpinner />;

  if (!userInfo) return null;

  return (
    <div className="flex flex-col md:gap-[70px]">
      <WithIconHeader title="알림" />
      <div className="flex flex-col justify-center w-full md:w-[674px] mx-auto  cursor-default">
        {notifi && notifi.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {notifi
              .slice()
              .reverse()
              .map((noti) => (
                <li key={noti.id} className="flex flex-col p-4 border-b border-gray-900">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-1">
                      <Image src={stamp} alt="Stamp" width={16} />
                      <Typography size={16} weight="bold" className="text-wrap">
                        {noti.title}
                      </Typography>
                    </div>
                    <Typography size={14} weight="medium" className="text-gray-600 text-right text-nowrap">
                      {new Date(noti.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                    </Typography>
                  </div>
                  <Typography size={14} weight="medium" className="text-gray-200 mt-2">
                    {noti.message}
                  </Typography>
                </li>
              ))}
          </ul>
        ) : (
          <div className="mx-auto">
            <Typography size={16} weight="bold" className="md:text-[12px]">
              알림이 없습니다.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

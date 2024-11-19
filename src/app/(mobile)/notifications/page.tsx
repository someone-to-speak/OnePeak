"use client";

import { Accordion, AccordionItem } from "@nextui-org/accordion";
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
      <div className="flex flex-col justify-center w-full md:w-[674px] mx-auto">
        {notifi && notifi.length > 0 ? (
          <Accordion isCompact>
            {notifi
              .slice()
              .reverse()
              .map((noti) => (
                <AccordionItem
                  key={noti.id}
                  title={
                    <div className="w-full flex flex-row justify-between items-center gap-2">
                      <div className="flex flex-row gap-2 items-center">
                        <Image src={stamp} alt="Stamp" width={16} />
                        <Typography size={16} weight="bold" className="text-wrap">
                          {noti.title}
                        </Typography>
                      </div>
                      <Typography size={14} weight="medium" className="text-gray-600 text-right text-nowrap">
                        {new Date(noti.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                      </Typography>
                    </div>
                  }
                  className="border-b border-gray-800 py-4 cursor-default"
                >
                  <Typography size={14} weight="medium" className="break-words max-w-full">
                    {noti.message}
                  </Typography>
                </AccordionItem>
              ))}
          </Accordion>
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

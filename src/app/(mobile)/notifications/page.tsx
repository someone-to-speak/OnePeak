"use client";

import { Accordion, AccordionItem } from "@nextui-org/accordion";
import Image from "next/image";
import stamp from "@/assets/stamp.svg";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { Typography } from "@/components/ui/typography";
import useNotifications from "@/hooks/useNotifications";
import { useUser } from "@/hooks/useUser";

const NotificationPage = () => {
  const { notifi } = useNotifications();
  const { userInfo } = useUser();

  if (!userInfo) return null;

  return (
    <div className="bg-white">
      <WithIconHeader title="알림" />
      <div className="flex flex-col">
        {notifi && notifi.length > 0 ? (
          <Accordion isCompact>
            {notifi
              .slice()
              .reverse()
              .map((noti) => (
                <AccordionItem
                  key={noti.id}
                  title={
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row gap-[8px]">
                        <Image src={stamp} alt={"Stamp"} width={18} height={18} />
                        <Typography size={16} weight="bold">
                          {noti.title}
                        </Typography>
                      </div>
                      <Typography size={10} weight="medium" className="text-gray-600">
                        {new Date(noti.created_at).toLocaleString()}
                      </Typography>
                    </div>
                  }
                  className="flex flex-col border-b border-gray-800 py-[20px]"
                >
                  <Typography size={12} weight="medium">
                    {noti.message}
                  </Typography>
                </AccordionItem>
              ))}
          </Accordion>
        ) : (
          <Typography size={16} weight="bold" className="text-gray-500">
            알림없음
          </Typography>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

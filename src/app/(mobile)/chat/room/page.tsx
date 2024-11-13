"use client";

import { useRouter, useSearchParams } from "next/navigation";
import MessageList from "./_components/MessageList";
import InputField from "./_components/InputField";
import { Suspense } from "react";
import { useMessage } from "@/hooks/useMessage";
import { Typography } from "@/components/ui/typography";
import Icon from "@/components/ui/icon";

const ChatroomPage = () => {
  return (
    <Suspense>
      <Chatroom />
    </Suspense>
  );
};

const Chatroom = () => {
  const searchParams = useSearchParams();
  const conversationId = searchParams?.get("id") as string;
  const router = useRouter();

  const { messages, isFetched, isError, sendMessage, sendMessageToChannel } = useMessage(conversationId);

  if (!isFetched) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Typography size={14} className="font-medium">
          채팅 내역을 불러오고 있습니다.
        </Typography>
      </div>
    );
  }

  if (isError) return <div>페이지 오류입니다.</div>;

  return (
    <div className="relative flex flex-col gap-[10px] pt-safe-offset-0 h-screen">
      <div className="flex items-center px-4 md:px-3 gap-[6px] py-[10.5px] md:py-[70px]">
        <Icon
          name="careLeft"
          size={24}
          color="#0D0D0D"
          className="md:w-[36px] md:h-[36px] cursor-pointer"
          onClick={() => router.back()}
        />
        <Typography size={18} className="font-bold md:text-[36px]">
          채팅방
        </Typography>
      </div>
      <MessageList messages={messages} />
      <InputField sendMessage={sendMessage} sendMessageToChannel={sendMessageToChannel} />
    </div>
  );
};

export default ChatroomPage;

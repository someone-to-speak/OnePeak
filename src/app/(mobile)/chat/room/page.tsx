"use client";

import { useRouter, useSearchParams } from "next/navigation";
import MessageList from "./_components/MessageList";
import InputField from "./_components/InputField";
import { Suspense } from "react";
import { useMessage } from "@/hooks/useMessage";
import WithIconHeader from "@/components/ui/WithIconHeader";
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

  const { messages, isLoading, isError, sendMessage, sendMessageToChannel } = useMessage(conversationId);

  if (isLoading) return <div>잠시만 기다려주세요...</div>;

  if (isError) return <div>페이지 오류입니다.</div>;

  return (
    <div className="flex flex-col px-4 md:px-3 gap-[10px] pt-safe-offset-0 h-screen">
      <div className="flex items-center gap-[6px] py-[10.5px] md:py-[70px]">
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

"use client";

import { useSearchParams } from "next/navigation";
import MessageList from "./_components/MessageList";
import InputField from "./_components/InputField";
import { Suspense } from "react";
import { useMessage } from "@/hooks/useMessage";
import WithIconHeader from "@/components/ui/WithIconHeader";

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

  const { messages, isLoading, isError, sendMessage } = useMessage(conversationId);

  if (isLoading) return <div>잠시만 기다려주세요...</div>;

  if (isError) return <div>페이지 오류입니다.</div>;

  return (
    <div className="w-full flex flex-col mx-0 pt-safe-offset-5 h-screen">
      <WithIconHeader title={"채팅방"} />
      <MessageList messages={messages} />
      <InputField sendMessage={sendMessage} />
    </div>
  );
};

export default ChatroomPage;

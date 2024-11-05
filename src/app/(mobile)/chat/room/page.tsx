"use client";

import { UUID } from "crypto";
import { useSearchParams } from "next/navigation";
import MessageList from "./_components/MessageList";
import InputField from "./_components/InputField";
import { Suspense } from "react";

const ChatroomPage = () => {
  return (
    <Suspense>
      <Chatroom />
    </Suspense>
  );
};

const Chatroom = () => {
  const searchParams = useSearchParams();
  const conversationId = searchParams?.get("id") as UUID;

  return (
    <div className="w-full flex flex-col mx-0">
      <MessageList conversationId={conversationId} />
      <InputField />
    </div>
  );
};

export default ChatroomPage;

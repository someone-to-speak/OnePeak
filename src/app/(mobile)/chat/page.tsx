"use client";

import Chat from "@/components/chat/chat";
import { useConversation } from "@/hooks/useConversation";
import Link from "next/link";

const Page = () => {
  const { conversationList, isLoading, isError } = useConversation();

  if (isLoading) {
    return <div>잠시만 기다려주세요...</div>;
  }

  if (isError) {
    return <div>에러가 발생...</div>;
  }

  return (
    <div>
      {conversationList?.map((conversation) => (
        <Link key={conversation.id} href={`/chat/room?id=${conversation.id}`}>
          <Chat conversation={conversation} />
        </Link>
      ))}
    </div>
  );
};

export default Page;

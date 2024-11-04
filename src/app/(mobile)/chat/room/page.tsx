"use client";

import { UUID } from "crypto";
import { useSearchParams } from "next/navigation";
import MessageList from "./_components/MessageList";

const Page = () => {
  const searchParams = useSearchParams();
  const conversationId = searchParams?.get("id") as UUID;

  return (
    <div className="w-full flex flex-col">
      <MessageList conversationId={conversationId} />
    </div>
  );
};

export default Page;

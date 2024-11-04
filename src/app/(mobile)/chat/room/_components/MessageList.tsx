"use client";

import { useMessage } from "@/hooks/useMessage";
import { UUID } from "crypto";

export const MessageList = ({ conversationId }: { conversationId: UUID }) => {
  const { messages, isLoading, isError } = useMessage(conversationId);

  return <div className="w-full"></div>;
};

export default MessageList;

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatMessageList from "@/components/chatBot/chat/ChatMessageList";
import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "@/services/supabaseChatbot";
import { Message } from "@/app/types/chatBotType/chatBotType";
import { Tables } from "../../../../database.types";
import React from "react";
import WithIconHeader from "@/components/ui/WithIconHeader";

type ReviewContentType = Tables<"review_content">;

const ChatMessagePage = () => {
  return (
    <Suspense>
      <ChatMessage />
    </Suspense>
  );
};

const ChatMessage = () => {
  const searchParams = useSearchParams();
  const situation = searchParams?.get("situation") as string;
  const reviewId = searchParams?.get("id");

  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => reviewApi.getUserInfo()
  });

  const { data: reviewMessages } = useQuery<ReviewContentType[], Error>({
    queryKey: ["learnMessage", reviewId],
    queryFn: () => reviewApi.getLearnMessage(user?.id as string, reviewId as string),
    enabled: !!user?.id && !!reviewId
  });

  // 시간 포맷팅 함수
  const formatDateTime = (dateStr: string, showSeconds = false) => {
    const date = new Date(dateStr);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    return `${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(
      2,
      "0"
    )} ${String(localDate.getHours()).padStart(2, "0")}:${String(localDate.getMinutes()).padStart(2, "0")}${
      showSeconds ? `:${String(localDate.getSeconds()).padStart(2, "0")}` : ""
    }`;
  };

  const parseStoredMessage = (messageStr: string, timestamp: string): Message | null => {
    try {
      const parsed = JSON.parse(messageStr);
      return {
        role: parsed.role,
        content: parsed.content,
        timestamp: formatDateTime(timestamp)
      };
    } catch (error) {
      console.error("메시지 파싱 에러:", error);
      return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full mx-auto bg-white">
      <div className="flex p-4">
        <WithIconHeader title={situation} />
      </div>

      <div className="flex-grow overflow-y-auto px-4 pb-16">
        {reviewMessages?.map((review) => {
          const parsedMessages = review.messages
            .map((msg) => parseStoredMessage(msg, review.created_at))
            .filter((msg): msg is Message => msg !== null);

          return (
            <div key={review.id} className="mb-4">
              <ChatMessageList messages={parsedMessages} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatMessagePage;

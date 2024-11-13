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
  // URL 파라미터 가져오기
  const searchParams = useSearchParams();
  const situation = searchParams?.get("situation") as string;
  const reviewId = searchParams?.get("id");

  // 유저 정보 조회
  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => reviewApi.getUserInfo()
  });

  // 저장된 채팅 메세지 조회 - 특정 review id에 대해서만
  const { data: reviewMessages } = useQuery<ReviewContentType[], Error>({
    queryKey: ["learnMessage", reviewId],
    queryFn: () => reviewApi.getLearnMessage(user?.id as string, reviewId as string),
    enabled: !!user?.id && !!reviewId
  });

  // 저장된 메시지 문자열을 Message 객체로 파싱
  const parseStoredMessage = (messageStr: string): Message | null => {
    try {
      const parsed = JSON.parse(messageStr);
      return {
        role: parsed.role,
        content: parsed.content
      };
    } catch (error) {
      console.error("메시지 파싱 에러:", error);
      return null;
    }
  };

  // 시간 포맷팅 함수
  const formatKSTDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul"
    });
  };

  return (
    <div className="flex flex-col h-screen w-full mx-auto bg-white">
      <div className="flex p-4">
        <WithIconHeader title={situation} />
      </div>

      <div className="flex-grow overflow-y-auto px-4 pb-16">
        {reviewMessages?.map((review) => {
          const parsedMessages = review.messages.map(parseStoredMessage).filter((msg): msg is Message => msg !== null);

          return (
            <div key={review.id} className="mb-4">
              <div className="text-sm text-gray-500 mb-2">{formatKSTDate(review.created_at)}</div>
              <ChatMessageList messages={parsedMessages} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatMessagePage;

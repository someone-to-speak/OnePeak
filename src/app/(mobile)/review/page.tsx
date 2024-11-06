"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatMessages } from "@/hooks/useChatMessages";
import ChatMessageList from "@/components/chatBot/chat/ChatMessageList";
import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "@/services/supabaseChatbot";
import { Message } from "@/app/types/chatBotType/chatBotType";
import { Tables } from "../../../../database.types";
import React from "react";

type ReviewContentType = Tables<"review_content">;

const ChatMessagePage = () => {
  return (
    <Suspense>
      <ChatMessage />
    </Suspense>
  );
};

const ChatMessage = () => {
  const router = useRouter();

  // URL 파라미터 가져오기
  const searchParams = useSearchParams();
  const situation = searchParams?.get("situation") as string;
  const level = Number(searchParams?.get("level"));
  // URL에서 review id 추출 ('id-숫자' 형태에서 숫자만 추출)
  const reviewIdParam = searchParams?.get("id");
  const reviewId = reviewIdParam?.split("-")[1];

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

  // ReviewContentType의 messages를 Message[] 형식으로 변환
  const convertToMessageFormat = (messages: string[]): Message[] => {
    return messages.map(parseStoredMessage).filter((msg): msg is Message => msg !== null);
  };

  // 메시지 정렬
  const filteredMessages = React.useMemo(() => {
    if (!reviewMessages) return null;

    return reviewMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [reviewMessages]);

  const { messages } = useChatMessages(situation, level);

  return (
    <div className="flex flex-col h-screen w-full mx-auto">
      <div className="flex-grow overflow-y-auto p-4 mb-16">
        <div className="flex">
          <button onClick={() => router.back()} className="mr-5">
            🔙
          </button>
          <h1 className="font-bold">{situation}</h1>
        </div>
        <div className="flex-grow overflow-y-auto p-4 mb-16">
          {/* 현재 진행 중인 대화 */}
          <ChatMessageList messages={messages} />

          {/* 저장된 대화 */}
          {filteredMessages &&
            filteredMessages.map((review) => (
              <div key={review.id} className="mt-8 border-t pt-4">
                <div className="text-sm text-gray-500 mb-4">{new Date(review.created_at).toLocaleDateString()}</div>
                <ChatMessageList messages={convertToMessageFormat(review.messages)} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessagePage;

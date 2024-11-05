"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import ChatInput from "@/components/chatBot/chat/ChatInput";
import ChatMessageList from "@/components/chatBot/chat/ChatMessageList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { reviewApi } from "@/services/supabaseChatbot";
import { AiMessages } from "@/type";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
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
  const supabase = createClient();

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

  const [userInput, setUserInput] = useState<string>("");
  const { messages, sendMessage } = useChatMessages(situation, level);

  const handleTranscribedText = async (text: string) => {
    try {
      await sendMessage(text);
    } catch (error) {
      console.log("메세지 전송 실패: ", error);
    }
  };

  const { isRecording, startRecording, stopRecording } = useAudioRecorder(handleTranscribedText);

  // 전송 버튼
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    try {
      sendMessage(userInput);
      console.log("messages", messages);
      setUserInput("");
    } catch (error) {
      console.log("메세지 전송 실패: ", error);
    }
  };

  // 채팅 종료 버튼
  const saveMessages = useMutation({
    mutationFn: ({ messages, review_id }: { messages: AiMessages[]; review_id: number }) =>
      reviewApi.postLearnMessage(messages, review_id),
    onSuccess: () => {
      alert("연결 확인");
    }
  });

  // 오늘 날짜 생성
  const today = new Date();
  // KST로 조정 (UTC+9)
  const kstToday = new Date(today.getTime() + 9 * 60 * 60 * 1000);
  const todayString = format(kstToday, "yyyy-MM-dd");

  const handleEndChat = async () => {
    if (user) {
      const { data: existingReviews, error } = await supabase
        .from("review")
        .select("*")
        .eq("user_id", user.id)
        .eq("situation", situation);

      const todayReview = existingReviews?.filter((review) => {
        const dateOnly = review.created_at.split("T")[0];
        return dateOnly === todayString;
      });

      if (todayReview && todayReview.length > 0) {
        saveMessages.mutate({ messages: messages, review_id: todayReview[0].id });
      }
      if (error) {
        console.log("대화 저장에 실패하였습니다.", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-full mx-auto bg-gray-100">
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
      <ChatInput
        userInput={userInput}
        setUserInput={setUserInput}
        isRecording={isRecording}
        onSubmit={handleSubmit}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onEndChat={handleEndChat}
      />
    </div>
  );
};

export default ChatMessagePage;

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import ChatInput from "@/components/chatBot/chat/ChatInput";
import ChatMessageList from "@/components/chatBot/chat/ChatMessageList";
import WithIconHeader from "@/components/ui/WithIconHeader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { reviewApi } from "@/services/supabaseChatbot";
import { AiMessages } from "@/type";
import { createClient } from "@/utils/supabase/client";
import ChatModal from "@/components/ChatModal";
import { Typography } from "@/components/ui/typography";

const ChatMessagePage = () => {
  return (
    <Suspense>
      <ChatMessage />
    </Suspense>
  );
};

const ChatMessage = () => {
  const supabase = createClient();

  // 유저 정보 조회
  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: reviewApi.getUserInfo
  });

  // 선택한 "오늘의 학습" 데이터 받아오기
  const searchParams = useSearchParams();
  const situation = searchParams?.get("situation") as string;
  const level = Number(searchParams?.get("level"));
  const router = useRouter();

  const [userInput, setUserInput] = useState<string>("");
  const { messages, sendMessage } = useChatMessages(situation, level);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTranscribedText = async (text: string) => {
    try {
      // 음성으로 변환된 텍스트를 메세지로 처리
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

  // 채팅 내용 저장
  const saveMessages = useMutation({
    mutationFn: ({ messages, review_id }: { messages: AiMessages[]; review_id: number }) => {
      // messages 배열을 JSON 문자열로 변환
      const stringMessages = messages.map((msg) => JSON.stringify(msg));
      return reviewApi.postLearnMessage(stringMessages, review_id);
    },
    onSuccess: () => {
      router.push("/");
    }
  });

  // 채팅 종료 버튼
  const handleEndChat = async () => {
    if (!user || messages.length === 0) return;

    try {
      const { data: newReview, error } = await supabase
        .from("review")
        .insert([
          {
            user_id: user.id,
            situation,
            level
          }
        ])
        .select("*")
        .single();

      if (error) throw error;

      // review 생성 성공 시 메세지 저장
      if (newReview) {
        saveMessages.mutate({
          messages,
          review_id: newReview.id
        });
      }
      // 성공적으로 처리되면 모달 닫기
      setIsModalOpen(false);
    } catch (error) {
      console.log("대화 저장에 실패하였습니다.", error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full mx-auto bg-white">
      <div className="flex-grow overflow-y-auto p-4 mb-16">
        <div className="flex justify-between items-center">
          <WithIconHeader title={situation} />
          <button
            type="button"
            className="w-[45px] h-[29px] bg-gray-900 text-gray-400 text-[14px] rounded-[20px] self-center"
            onClick={() => setIsModalOpen(true)}
          >
            <Typography size={14} weight={"normal"}>
              종료
            </Typography>
          </button>
          {/* 종료 확인 모달 */}
          <ChatModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleEndChat}
            title="정말 학습을 종료하시겠습니까?"
            description="다시 이어서 대화할 수 없습니다"
            confirmText="종료"
            confirmButtonStyle="primary"
          />
        </div>
        <div className="flex-grow overflow-y-auto p-4 mb-16">
          <ChatMessageList messages={messages} />
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

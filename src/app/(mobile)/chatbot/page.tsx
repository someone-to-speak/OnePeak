"use client";

import { Message } from "@/app/types/chatBotType/chatBotType";
import { convertSpeechToText, getChatResponse } from "@/utils/chatbot/chatBotApi";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import ChatInput from "@/components/chatBot/chat/ChatInput";
import ChatMessageList from "@/components/chatBot/chat/ChatMessageList";

const ChatMessage = () => {
  const router = useRouter();

  // 선택한 "오늘의 학습" 데이터 받아오기
  const searchParams = useSearchParams();
  const situation = searchParams?.get("situation") as string;
  const level = Number(searchParams?.get("level"));

  const [userInput, setUserInput] = useState<string>("");
  const { messages, sendMessage } = useChatMessages(situation, level);

  const handleTranscribedText = async (text: string) => {
    try {
      // 음성으로 변환딘 텍스트를 메세지로 처리
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
      setUserInput("");
    } catch (error) {
      console.log("메세지 전송 실패: ", error);
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
      />
    </div>
  );
};

export default ChatMessage;

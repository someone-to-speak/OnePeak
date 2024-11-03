"use client";

import { Message } from "@/app/types/chatBotType/chatBotType";
import { convertSpeechToText, getChatResponse } from "@/utils/chatbot/chatBotApi";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ChatMessage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chuncksRef = useRef<Blob[]>([]);

  const router = useRouter();

  // 선택한 "오늘의 학습" 데이터 받아오기
  const searchParams = useSearchParams();
  const situation = searchParams?.get("situation") as string;
  const level = Number(searchParams?.get("level"));

  // 챗봇의 첫 메세지 추가
  const initiateChat = () => {
    const initialMessage: Message = {
      role: "system",
      content: "안녕하세요! 준비가 되셨다면 start라고 입력해주세요!"
    };
    setMessages([initialMessage]);
  };

  useEffect(() => {
    initiateChat();
  }, []);

  // 챗봇과 대화하기
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 사용자 메세지 추가
    const userMessage: Message = {
      role: "user",
      content: userInput
    };

    const newMessages: Message[] = [...messages, userMessage];

    setMessages(newMessages);
    setUserInput("");

    // 챗봇의 응답 가져오기
    if (situation && level !== undefined) {
      const botResponse = await getChatResponse(newMessages, situation, level);

      if (botResponse) {
        const botMessage: Message = { role: "assistant", content: botResponse };

        // 챗봇 메세지 추가
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    }
  };

  // 음성 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000
        }
      });

      // 브라우저가 지원하는 mimeType 확인
      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
        mimeType = "audio/ogg";
      }
      // 오디오 형식을 명시적으로 지정
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
      });

      mediaRecorderRef.current = mediaRecorder;
      chuncksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chuncksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chuncksRef.current, { type: mimeType });
        console.log("최종 오디오 타입: ", audioBlob.type); // 디버깅용

        try {
          const audioBlob = new Blob(chuncksRef.current, { type: "audio/webm" });
          const audioFile = new File([audioBlob], "audio.webm", {
            type: "audio/webm"
          });

          // 파일 크기와 형식 확인
          console.log("녹음된 파일 정보:", {
            size: audioFile.size,
            type: audioFile.type,
            name: audioFile.name
          });

          // 빈 파일인지 확인
          if (audioFile.size === 0) {
            throw new Error("녹음된 파일이 비어있습니다");
          }

          const text = await convertSpeechToText(audioFile);
          setUserInput(text);
        } catch (error) {
          console.error("음성 변환 실패:", error);
          alert("음성을 텍스트로 변환하는데 실패했습니다. ");
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.log("음성 변환 실패: ", error);
      alert("마이크 접근에 실패하였습니다.");
    }
  };

  // 음성 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // 스트림 정지
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
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
        {messages.map((msg, index) => (
          <div key={index} className={msg.role}>
            <strong>{msg.role === "user" ? "나" : "챗봇"}</strong>
            <div className="border border-spacing-10 text-green-500 p-5">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="overflow-y-auto"></div>
      <div></div>
      <form className="sticky bottom-[55px] flex w-full bg-gray-200 p-4" onSubmit={sendMessage}>
        <input
          className="flex-grow p-2 rounded border border-gray-400"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="메세지를 입력해주세요."
        />
        <button
          type="button"
          className={`ml-2 px-4 py-2 rounded ${isRecording ? "bg-red-500" : "bg-gray-500"} text-white`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "🎤 중지" : "🎤 음성입력"}
        </button>
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" type="submit">
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatMessage;

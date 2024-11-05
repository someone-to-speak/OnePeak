"use client";

import { generateAITuthorChat } from "@/api/openAI/gpt";
import { convertSpeechToText } from "@/api/openAI/whisper";
import { Message } from "@/types/chatType/chatType";
import { useEffect, useState } from "react";

const Coaching = ({ message }: { message: Message }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sttText, setSttText] = useState<string>("");
  const [tuthorText, setTuthorText] = useState<string>("");

  useEffect(() => {
    const handleSTT = async () => {
      setIsLoading(true);

      const _sttText = await convertSpeechToText(message.content);
      const _tuthorText = await generateAITuthorChat(_sttText);
      setSttText(_sttText);
      setTuthorText(_tuthorText as string);
      setIsLoading(false);
    };

    handleSTT();
  }, [message.content]);

  if (isLoading) {
    <div>잠시만 기다려주세요...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <p>{sttText}</p>
      <p>{tuthorText}</p>
    </div>
  );
};

export default Coaching;

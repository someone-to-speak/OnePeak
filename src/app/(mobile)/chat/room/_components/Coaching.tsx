"use client";

import { generateAITuthorChat } from "@/api/openAI/gpt";
import { convertSpeechToText } from "@/api/openAI/whisper";
import { useEffect, useState } from "react";

const Coaching = ({ message }: { message: string }) => {
  const [tutorText, setTutorText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleSTT = async () => {
      const _sttText = await convertSpeechToText(message);
      const _tutorText = await generateAITuthorChat(_sttText);

      setTutorText(_tutorText as string);
      setIsLoading(false);
    };

    handleSTT();
  }, [message]);

  if (isLoading)
    return (
      <div className="font-suit leading-normal inline-block align-middle antialiased font-bold text-sm md:text-[16px]">
        코칭중...
      </div>
    );

  return (
    <div className="max-w-[214px] md:max-w-[354px] py-2 px-3 bg-secondary-900 rounded-2xl shadow-sm rounded-br-none">
      <div className="font-suit leading-normal inline-block align-middle antialiased font-bold text-sm md:text-[16px]">
        <span className="text-secondary-500">
          [Ai 튜터링 결과]
          <br />
        </span>
        <span className="text-gray-300">{tutorText}</span>
      </div>
    </div>
  );
};

export default Coaching;

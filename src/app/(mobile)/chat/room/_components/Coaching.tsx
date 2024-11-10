"use client";

import { generateAITuthorChat } from "@/api/openAI/gpt";
import { convertSpeechToText } from "@/api/openAI/whisper";
import { Typography } from "@/components/ui/typography";
import { useEffect, useState } from "react";

const Coaching = ({ message }: { message: string }) => {
  const [sttText, setSttText] = useState<string>("");
  const [tuthorText, setTuthorText] = useState<string>("");

  useEffect(() => {
    const handleSTT = async () => {
      const _sttText = await convertSpeechToText(message);
      const _tuthorText = await generateAITuthorChat(_sttText);
      setSttText(_sttText);
      setTuthorText(_tuthorText as string);
    };

    handleSTT();
  }, [message]);

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="max-w-[214px] py-2 px-3 bg-primary-800 rounded-2xl shadow-sm rounded-br-none">
        <Typography size={12} className="font-medium">
          {sttText}
        </Typography>
      </div>
      <div className="max-w-[214px] py-2 px-3 bg-secondary-900 rounded-2xl shadow-sm rounded-br-none">
        <Typography size={12} className="font-medium">
          {tuthorText}
        </Typography>
      </div>
    </div>
  );
};

export default Coaching;

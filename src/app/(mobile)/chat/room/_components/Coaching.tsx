"use client";

import { MessageWithUserInfo } from "@/types/chatType/chatType";
import { useEffect, useState } from "react";

const Coaching = ({ message }: { message: MessageWithUserInfo }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sttText, setSttText] = useState<string>("");

  useEffect(() => {
    const handleSTT = async () => {
      setIsLoading(true);
      const response = await fetch("/api/speechToText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: message.content })
      });
      const _sttText = await response.json();
      setSttText(_sttText.text);
      setIsLoading(false);
    };

    handleSTT();
  }, [message.content]);

  if (isLoading) {
    <div>잠시만 기다려주세요...</div>;
  }

  return <div>{sttText}</div>;
};

export default Coaching;

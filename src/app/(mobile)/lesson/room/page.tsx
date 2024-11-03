"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WebRTCService } from "@/services/webrtcService";
import { uploadRecording } from "@/api/supabase/record";
import { SignalData } from "@/types/chatType/chatType";
import { checkOrAddParticipant, createChannel, getOrCreateConversationId, insertMessage } from "@/api/supabase/chat";
import { useUserInfo } from "@/hooks/getUserInfo";

const VideoChat = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams?.get("id");
  const { data: userId } = useUserInfo();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcServiceRef = useRef<WebRTCService | null>(null);
  const channel = useRef(createChannel(roomId || ""));

  const handleCloseMatching = async () => {
    channel.current?.send({
      type: "broadcast",
      event: "closeMatching"
    });

    await getOrCreateConversationId(roomId as string);
    await handleCloseMatchingSignal();
  };

  const handleLeaveAloneSignal = useCallback(async () => {
    channel.current?.unsubscribe();
    await webrtcServiceRef.current?.closeConnection();
    router.push("/lesson");
  }, [router]);

  const handleStopRecording = useCallback(async () => {
    const localAudioBlob = await webrtcServiceRef.current?.stopRecording();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${roomId}_${timestamp}.webm`;

    const url = await uploadRecording(localAudioBlob as Blob, fileName as string);
    await checkOrAddParticipant(roomId as string, userId as string);
    await insertMessage(roomId as string, url as string, "audio");
  }, []);

  const handleCloseMatchingSignal = useCallback(async () => {
    await handleStopRecording();
    channel.current?.unsubscribe();
    await webrtcServiceRef.current?.closeConnection();
    router.push("/lesson");
  }, [handleStopRecording, router]);

  useEffect(() => {
    if (!channel.current || !roomId) return;

    // // 브로드캐스팅 채널 구독하고, 관련 이벤트 리스너 설정
    const init = async () => {
      channel.current
        .on(
          "broadcast",
          { event: "ice-candidate" },
          async (payload) => await webrtcServiceRef.current?.handleSignalData(payload as SignalData)
        )
        .on(
          "broadcast",
          { event: "offer" },
          async (payload) => await webrtcServiceRef.current?.handleSignalData(payload as SignalData)
        )
        .on(
          "broadcast",
          { event: "answer" },
          async (payload) => await webrtcServiceRef.current?.handleSignalData(payload as SignalData)
        )
        .on("broadcast", { event: "leaveAlone" }, async () => await handleLeaveAloneSignal())
        .on("broadcast", { event: "closeMatching" }, async () => await handleCloseMatchingSignal());
      channel.current.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // webrtc 연결을 위한 초기 설정
          webrtcServiceRef.current = new WebRTCService(localVideoRef, remoteVideoRef, channel.current);
          await webrtcServiceRef.current.init();

          // sdp 정보 발신
          await webrtcServiceRef.current.createOffer();
        }
      });
    };

    init();

    const cleanUp = async () => {
      channel.current?.send({
        type: "broadcast",
        event: "leaveAlone"
      });
      await handleLeaveAloneSignal();
    };

    return () => {
      cleanUp();
    };
  }, []);

  return (
    <div>
      <h1>1:1 화상 채팅</h1>
      <button onClick={handleCloseMatching}>종료하기</button>
      <div className="flex flex-col h-auto">
        <video ref={remoteVideoRef} autoPlay />
        <video ref={localVideoRef} autoPlay />
      </div>
    </div>
  );
};

export default VideoChat;

// import OpenAI from "openai";
// import React from "react";

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_KEY
// });

// const Page = async () => {
//   const text = "나 갈게 너집안으로";
//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a helpful Korean and English tutor who will help you improve your spoken language so that you can express yourself more naturally. If the user speaks in Korean, put the expression to correct in Korean in '' and give advice in English. If the user speaks in English, put the expression to be corrected in English in '' and give advice in Korean."
//       },
//       {
//         role: "user",
//         content: `${text}`
//       }
//     ]
//   });

//   const result = completion.choices[0].message.content;
//   // console.log(completion.choices[0].message);

//   return <>{result}</>;
// };

// export default Page;

// // const getAIData = async () => {
// //   const data = await fetch(`/api/getSuggestion`);
// //   const result = await data?.json();
// //   console.log("result", result);
// //   return result;
// // };
// // getAIData();

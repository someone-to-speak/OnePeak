"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WebRTCService } from "@/services/webrtcService";
import { createChannel, getUserId } from "@/repositories/clientRepository";
import { uploadRecording } from "@/api/supabase/record";
import { useUserInfo } from "@/hooks/getUserInfo";

type SignalData = {
  event: "offer" | "answer" | "ice-candidate" | "leave";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

const VideoChat = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams?.get("room");
  const { data: userId } = useUserInfo();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcServiceRef = useRef<WebRTCService | null>(null);
  const channel = useRef(createChannel(roomId || ""));

  useEffect(() => {
    if (!roomId) return;

    const init = async () => {
      const userId = await getUserId();

      channel.current
        .on("broadcast", { event: "ice-candidate" }, (payload: SignalData) =>
          webrtcServiceRef.current?.handleSignalData(payload)
        )
        .on(
          "broadcast",
          { event: "offer" },
          async (payload: SignalData) => await webrtcServiceRef.current?.handleSignalData(payload)
        )
        .on(
          "broadcast",
          { event: "answer" },
          async (payload: SignalData) => await webrtcServiceRef.current?.handleSignalData(payload)
        )
        .on("broadcast", { event: "leave" }, handleLeaveSignal) // "leave" 이벤트 핸들러 추가
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            webrtcServiceRef.current = new WebRTCService(localVideoRef, remoteVideoRef, channel.current);
            await webrtcServiceRef.current.init();
            // if (userId === roomId) {
            //   console.log("webrtcServiceRef.current: ", webrtcServiceRef.current);
            //   await webrtcServiceRef.current.createOffer();
            // }
            await webrtcServiceRef.current.createOffer();
          }
        });
    };

    init();

    return () => {
      handleLeave();
    };
  }, []);

  const handleClickLeaveButton = async () => {
    channel.current?.send({
      type: "broadcast",
      event: "leave"
    });
    channel.current?.unsubscribe();
    await handleStopRecording();
    await webrtcServiceRef.current?.closeConnection();
    router.push("/chat");
  };

  const handleLeaveSignal = async () => {
    await handleStopRecording();
    channel.current?.unsubscribe();
    await webrtcServiceRef.current?.closeConnection();
    router.push("/chat");
  };

  const handleStopRecording = async () => {
    const localAudioBlob = await webrtcServiceRef.current?.stopRecording();

    if (localAudioBlob && roomId) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `${roomId}_${userId}_${timestamp}.webm`;

      await uploadRecording(localAudioBlob, fileName, roomId);
    } else {
      console.error("Recording failed: No local blob available.");
    }
  };

  return (
    <div>
      <h1>1:1 화상 채팅</h1>
      <button onClick={handleClickLeaveButton}>종료하기</button>
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
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
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

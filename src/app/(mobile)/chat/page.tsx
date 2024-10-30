"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";

type SignalData = {
  event: "offer" | "answer" | "ice-candidate" | "leave";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

const VideoChat = () => {
  const supabase = createClient();
  const router = useRouter();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const channel = useRef<RealtimeChannel | null>(null);
  const searchParams = useSearchParams();
  const roomId = searchParams?.get("room")?.split(",")[0];

  useEffect(() => {
    if (!roomId) return;

    const init = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      const userId = user?.id;

      const signalingChannel = supabase.channel(`video-chat-${roomId}`);
      channel.current = signalingChannel;

      signalingChannel
        .on("broadcast", { event: "ice-candidate" }, (payload: SignalData) => handleSignalData(payload))
        .on("broadcast", { event: "offer" }, (payload: SignalData) => handleSignalData(payload))
        .on("broadcast", { event: "answer" }, (payload: SignalData) => handleSignalData(payload))
        .on("broadcast", { event: "leave" }, handleLeaveSignal) // "leave" 이벤트 핸들러 추가
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log("Connected to signaling channel");
            initWebRTC(userId);
          } else if (status === "CHANNEL_ERROR") {
            console.log("CHANNEL_ERROR");
          }
        });
    };

    init();

    return () => {
      handleLeave();
    };
  }, [roomId]);

  const initWebRTC = async (userId: string | undefined) => {
    const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    const peerConnection = new RTCPeerConnection(config);
    peerConnectionRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      // console.log("onicecandidate event: :", event);
      if (event.candidate) {
        // console.log("send candidate");
        channel.current?.send({
          type: "broadcast",
          event: "ice-candidate",
          candidate: event.candidate
        });
      }
    };

    peerConnection.ontrack = (event) => {
      // console.log("ontrack");
      if (remoteVideoRef.current) {
        // console.log("peerConnection: ", peerConnection);
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("Connection State:", peerConnection.connectionState);
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", peerConnection.iceConnectionState);
    };

    peerConnection.onicegatheringstatechange = () => {
      console.log("ICE Gathering State:", peerConnection.iceGatheringState);
    };

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    if (userId === roomId) {
      await createOffer();
    }
  };

  const handleSignalData = async (payload: SignalData) => {
    try {
      if (!peerConnectionRef.current) return;
      console.log("payload: ", payload);
      const { event, sdp, candidate } = payload;
      console.log("sdp: ", sdp);
      if (event === "offer" && sdp) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        // console.log("channel: ", channel);
        const serverResponse = channel.current?.send({
          type: "broadcast",
          event: "answer",
          sdp: answer
        });
        console.log("serverResponse: ", serverResponse);
      } else if (event === "answer" && sdp) {
        console.log("answer");
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      } else if (event === "ice-candidate" && candidate) {
        console.log("candidate");
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
      console.log("end");
    } catch (error) {
      console.error("Error handling signal data:", error);
    }
  };

  const createOffer = async () => {
    console.log("createOffer");
    if (!peerConnectionRef.current) {
      console.log("not found peerConnectionRef");
      return;
    }

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    channel.current?.send({
      type: "broadcast",
      event: "offer",
      sdp: offer
    });
  };

  const handleLeave = () => {
    channel.current?.send({
      type: "broadcast",
      event: "leave"
    });
    channel.current?.unsubscribe();
    peerConnectionRef.current?.close();
    router.push("/"); // 홈으로 라우트
  };

  const handleLeaveSignal = () => {
    console.log("The other user has left the chat.");
    router.push("/"); // 상대방이 나가면 홈으로 이동
  };

  return (
    <div>
      <h1>1:1 화상 채팅</h1>
      <button onClick={handleLeave}>종료하기</button>
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

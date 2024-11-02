"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WebRTCService } from "@/services/webrtcService";
import { createChannel } from "@/repositories/clientRepository";
import { uploadRecording } from "@/api/supabase/record";
import { SignalData } from "@/types/chatType/chatType";

const VideoChat = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams?.get("id");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcServiceRef = useRef<WebRTCService | null>(null);
  const channel = useRef(createChannel(roomId || ""));

  const handleCloseMatching = async () => {
    channel.current?.send({
      type: "broadcast",
      event: "closeMatching"
    });

    await handleCloseMatchingSignal();
  };

  const handleLeaveAloneSignal = useCallback(async () => {
    channel.current?.unsubscribe();
    await webrtcServiceRef.current?.closeConnection();
    router.push("/lesson");
  }, [router]);

  const handleStopRecording = useCallback(async () => {
    const localAudioBlob = await webrtcServiceRef.current?.stopRecording();

    if (localAudioBlob && roomId) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `${roomId}_${timestamp}.webm`;

      await uploadRecording(localAudioBlob, fileName);
    } else {
      console.error("Recording failed: No local blob available.");
    }
  }, [roomId]);

  const handleCloseMatchingSignal = useCallback(async () => {
    channel.current?.unsubscribe();
    await handleStopRecording();
    await webrtcServiceRef.current?.closeConnection();
    router.push("/lesson");
  }, [handleStopRecording, router]);

  useEffect(() => {
    if (!channel.current) return;
    console.log("useEffect");
    // 브로드캐스팅 채널 구독하고, 관련 이벤트 리스너 설정
    const init = async () => {
      // if (!channel.current) return;

      channel.current
        .on("broadcast", { event: "ice-candidate" }, (payload) =>
          webrtcServiceRef.current?.handleSignalData(payload as SignalData)
        )
        .on("broadcast", { event: "offer" }, (payload) =>
          webrtcServiceRef.current?.handleSignalData(payload as SignalData)
        )
        .on("broadcast", { event: "answer" }, (payload) =>
          webrtcServiceRef.current?.handleSignalData(payload as SignalData)
        )
        .on("broadcast", { event: "leaveAlone" }, handleLeaveAloneSignal)
        .on("broadcast", { event: "closeMatching" }, handleCloseMatchingSignal)
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            // webrtc 연결을 위한 초기 설정
            webrtcServiceRef.current = new WebRTCService(localVideoRef, remoteVideoRef, channel.current);
            await webrtcServiceRef.current.init();
            // if (userId === roomId) {
            //   console.log("webrtcServiceRef.current: ", webrtcServiceRef.current);
            //   await webrtcServiceRef.current.createOffer();
            // }

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
  }, [handleLeaveAloneSignal, handleCloseMatchingSignal, roomId]);

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

// const page = () => {
//   return <div>page</div>;
// };

// export default page;

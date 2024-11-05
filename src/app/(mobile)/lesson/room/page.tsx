"use client";

import { Suspense, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WebRTCService } from "@/services/webrtcService";
import { uploadRecording } from "@/api/supabase/record";
import { SignalData } from "@/types/chatType/chatType";
import { checkOrAddParticipant, createChannel, getOrCreateConversationId, insertMessage } from "@/api/supabase/chat";
import { UUID } from "crypto";
import { useUser } from "@/hooks/useUser";

const VideoChatPage = () => {
  return (
    <Suspense>
      <VideoChat />
    </Suspense>
  );
};

const VideoChat = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams?.get("id") as UUID;
  const { userInfo } = useUser();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcServiceRef = useRef<WebRTCService | null>(null);
  const channel = useRef(createChannel(roomId || ""));

  const handleCloseMatching = async () => {
    channel.current?.send({
      type: "broadcast",
      event: "closeMatching"
    });

    await getOrCreateConversationId(roomId as UUID);
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
    await checkOrAddParticipant(roomId as UUID, userInfo?.id as string);
    await insertMessage(roomId as UUID, url as string, "audio");
  }, [roomId, userInfo?.id]);

  const handleCloseMatchingSignal = useCallback(async () => {
    await channel.current?.unsubscribe();
    await handleStopRecording();
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

    // const cleanUp = async () => {
    //   channel.current?.send({
    //     type: "broadcast",
    //     event: "leaveAlone"
    //   });
    //   await handleLeaveAloneSignal();
    // };

    // return () => {
    //   cleanUp();
    // };
  }, [handleCloseMatchingSignal, handleLeaveAloneSignal, roomId]);

  return (
    <div>
      <h1>1:1 화상 채팅</h1>
      <button onClick={handleCloseMatching}>종료하기</button>
      <div className="flex flex-col h-auto">
        <video className={"scale-x-[-1]"} ref={remoteVideoRef} autoPlay />
        <video className={"scale-x-[-1]"} ref={localVideoRef} autoPlay />
      </div>
    </div>
  );
};

export default VideoChatPage;

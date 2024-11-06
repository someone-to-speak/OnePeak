"use client";

import { Suspense, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WebRTCService } from "@/services/webrtcService";
import { uploadRecording } from "@/api/supabase/record";
import { SignalData } from "@/types/chatType/chatType";
import { checkOrAddParticipant, createChannel, getOrCreateConversationId, insertMessage } from "@/api/supabase/chat";
import { UUID } from "crypto";
import { useUser } from "@/hooks/useUser";
import Camera from "@/assets/lesson/camera.svg";
import Microphone from "@/assets/lesson/microphone.svg";
import Power from "@/assets/lesson/power.svg";
import Prohibit from "@/assets/lesson/prohibit.svg";
import Image from "next/image";

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
    sessionStorage.removeItem("session");
    await channel.current?.unsubscribe();
    await webrtcServiceRef.current?.closeConnection();
  }, []);

  const handleStopRecording = useCallback(async () => {
    const localAudioBlob = await webrtcServiceRef.current?.stopRecording();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${roomId}_${timestamp}.webm`;

    const url = await uploadRecording(localAudioBlob as Blob, fileName as string);
    await checkOrAddParticipant(roomId as UUID, userInfo?.id as string);
    await insertMessage(roomId as UUID, url as string, "audio");
  }, [roomId, userInfo?.id]);

  const handleCloseMatchingSignal = useCallback(async () => {
    sessionStorage.removeItem("session");
    await channel.current?.unsubscribe();
    await handleStopRecording();
    await webrtcServiceRef.current?.closeConnection();
    router.push("/lesson");
  }, [handleStopRecording, router]);

  useEffect(() => {
    if (!channel.current || !roomId) return;

    const roomSession = sessionStorage.getItem("session");

    if (roomSession) {
      return;
    } else {
      sessionStorage.setItem("session", "subscribe");
    }

    // // 브로드캐스팅 채널 구독하고, 관련 이벤트 리스너 설정
    const init = async () => {
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
        .on("broadcast", { event: "closeMatching" }, handleCloseMatchingSignal);
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
      await handleLeaveAloneSignal();
    };

    return () => {
      cleanUp();
    };
  }, [handleCloseMatchingSignal, handleLeaveAloneSignal, roomId]);

  return (
    <div className="relative h-auto">
      <button className="cursor-pointer absolute bg-black rounded-full p-[10px] z-[100] top-[68px] right-[16px]">
        <Image className="cursor-pointer" src={Prohibit} alt={""} width={25} height={25} />
      </button>
      <button
        className="cursor-pointer absolute left-1/2  transform -translate-x-1/2 -translate-y-1/2 bg-red-400 rounded-full p-[10px] z-[100] bottom-4"
        onClick={handleCloseMatching}
      >
        <Image className="cursor-pointer" src={Power} alt={""} width={25} height={25} />
      </button>
      <div className="flex flex-col w-[50px] y-[130px] py-[13px] px-[9px] gap-[20px] rounded-[30px] items-center absolute top-1/2 -translate-y-1/2 left-[16px] bg-black  z-[100]">
        <button className="cursor-pointer">
          <Image className="cursor-pointer" src={Microphone} alt={""} width={32} height={32} />
        </button>
        <button className="cursor-pointer">
          <Image className="cursor-pointer" src={Camera} alt={""} width={32} height={32} />
        </button>
      </div>
      <video
        className={"scale-x-[-1] absolute w-[136px] h-[136px] top-[68px] left-[16px] z-[100] object-cover "}
        ref={remoteVideoRef}
        autoPlay
      />
      <video className={"scale-x-[-1] h-lvh object-cover"} ref={localVideoRef} autoPlay />
    </div>
  );
};

export default VideoChatPage;

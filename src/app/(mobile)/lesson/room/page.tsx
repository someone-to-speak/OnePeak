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
import { useScreenSizeStore } from "@/shared/screen-store-provider";
import { Typography } from "@/components/ui/typography";
import Icon from "@/components/ui/icon";

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
  const isSubscribed = useRef(false);

  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

  const handleCloseMatching = async () => {
    channel.current?.send({
      type: "broadcast",
      event: "closeMatching"
    });

    await getOrCreateConversationId(roomId as UUID);
    await handleCloseMatchingSignal();
  };

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
    router.replace("/lesson");
  }, [handleStopRecording, router]);

  useEffect(() => {
    if (!channel.current || !roomId) return;

    const resetVideo = async () => {
      await webrtcServiceRef.current?.reset();
      await webrtcServiceRef.current?.init();
    };
    resetVideo();
    const handleBackButton = async () => {
      await channel.current?.send({
        type: "broadcast",
        event: "back"
      });

      await channel.current?.unsubscribe();
      await webrtcServiceRef.current?.closeConnection();
    };

    const handleRefresh = async () => {
      channel.current?.send({
        type: "broadcast",
        event: "refresh"
      });

      await channel.current?.unsubscribe();
      await webrtcServiceRef.current?.closeConnection();
    };

    const handleBackSignal = async () => {
      await channel.current?.unsubscribe();
      await webrtcServiceRef.current?.closeConnection();
      router.replace("/lesson");
      alert("사용자와의 연결이 끊어졌습니다.");
    };

    const handleRefreshSignal = async () => {
      await webrtcServiceRef.current?.reset();
      await webrtcServiceRef.current?.init();
    };

    // // 브로드캐스팅 채널 구독하고, 관련 이벤트 리스너 설정
    const init = async () => {
      if (isSubscribed.current) return;

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
        .on("broadcast", { event: "refresh" }, handleRefreshSignal)
        .on("broadcast", { event: "back" }, handleBackSignal)
        .on("broadcast", { event: "closeMatching" }, handleCloseMatchingSignal);
      channel.current.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          isSubscribed.current = true;
          // webrtc 연결을 위한 초기 설정
          webrtcServiceRef.current = new WebRTCService(localVideoRef, remoteVideoRef, channel.current);
          await webrtcServiceRef.current.init();

          // sdp 정보 발신
          await webrtcServiceRef.current.createOffer();
        }
      });
    };

    init();

    window.onpopstate = () => {
      setTimeout(handleBackButton, 0);
    };

    // window.addEventListener("popstate", handleBackButton);
    window.addEventListener("beforeunload", handleRefresh);

    return () => {
      // window.removeEventListener("popstate", handleBackButton);
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, [isLargeScreen, handleCloseMatchingSignal, roomId, router]);

  return (
    <>
      {isLargeScreen ? (
        <div className="flex flex-col px-3">
          <Typography size={36} className="font-suit font-bold my-[70px]">
            1:1 언어수업
          </Typography>
          <div className="flex gap-[10px] mb-[50px]">
            <div className="flex-1 h-auto">
              <video
                className={"w-full scale-x-[-1] aspect-[490/742] object-cover rounded-md"}
                ref={remoteVideoRef}
                autoPlay
                playsInline
                onPlay={(e) => e.preventDefault()} // 재생 이벤트 무시
                onPause={(e) => e.preventDefault()} // 일시정지 이벤트 무시
                onClick={(e) => e.preventDefault()} // 클릭 이벤트 무시
                style={{ pointerEvents: "none" }}
              />
            </div>
            <div className="flex-1 h-auto">
              <video
                className={"w-full scale-x-[-1] aspect-[490/742] object-cover rounded-md"}
                ref={localVideoRef}
                autoPlay
                playsInline
                onPlay={(e) => e.preventDefault()} // 재생 이벤트 무시
                onPause={(e) => e.preventDefault()} // 일시정지 이벤트 무시
                onClick={(e) => e.preventDefault()} // 클릭 이벤트 무시
                style={{ pointerEvents: "none" }}
              />
            </div>
          </div>
          <div className="w-full flex justify-center items-center gap-14">
            <button className="p-[9px] bg-black rounded-md">
              <Icon name="camera" size={42} color="white" />
            </button>
            <button className="p-[9px] bg-red-400 rounded-md">
              <Icon name="power" size={42} color="white" />
            </button>
            <button className="p-[9px] bg-black rounded-md">
              <Icon name="microphone" size={42} color="white" />
            </button>
          </div>
        </div>
      ) : (
        <div className="h-auto">
          <button className="cursor-pointer absolute bg-black rounded-full p-[10px] z-[100] top-[68px] right-[16px]">
            <Image className="cursor-pointer" src={Prohibit} alt={""} width={25} height={25} />
          </button>
          <button
            className="cursor-pointer absolute left-1/2  transform -translate-x-1/2 -translate-y-1/2 bg-red-400 rounded-full p-[10px] z-[100] bottom-4 pb-safe-offset-2"
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
            className={"scale-x-[-1] absolute w-[136px] h-[136px] top-[68px] left-[16px] z-[100] object-cover"}
            ref={remoteVideoRef}
            autoPlay
            playsInline
            onPlay={(e) => e.preventDefault()} // 재생 이벤트 무시
            onPause={(e) => e.preventDefault()} // 일시정지 이벤트 무시
            onClick={(e) => e.preventDefault()} // 클릭 이벤트 무시
            style={{ pointerEvents: "none" }}
          />
          <video
            className={"scale-x-[-1] h-lvh object-cover"}
            ref={localVideoRef}
            autoPlay
            playsInline
            onPlay={(e) => e.preventDefault()} // 재생 이벤트 무시
            onPause={(e) => e.preventDefault()} // 일시정지 이벤트 무시
            onClick={(e) => e.preventDefault()} // 클릭 이벤트 무시
            style={{ pointerEvents: "none" }}
          />
        </div>
      )}
    </>
  );
};

export default VideoChatPage;

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Typography } from "@/components/ui/typography";
import Icon from "@/components/ui/icon";
import { useScreenSizeStore } from "@/shared/StoreProvider";
import { useCallerCallee } from "@/hooks/useCallerCallee";
import { useWebRTC } from "@/hooks/useWebRTC";

const VideoChatPage = () => {
  return (
    <Suspense>
      <VideoChat />
    </Suspense>
  );
};

const VideoChat = () => {
  const searchParams = useSearchParams();
  const roomId = searchParams?.get("id") as string;
  const isLargeScreen = useScreenSizeStore((state) => state.isLargeScreen);

  const { role } = useCallerCallee(roomId);
  const { channelRef, localVideoRef, remoteVideoRef, isCameraOn, toggleCamera, isMicOn, toggleMicrophone, close } =
    useWebRTC(roomId, role as string);

  const handleClickedCloseButton = async () => {
    await channelRef.current?.send({
      type: "broadcast",
      event: "closeMatching"
    });

    await close();
  };

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
              {isCameraOn ? (
                <Icon name="cameraOn" size={42} color="white" onClick={toggleCamera} />
              ) : (
                <Icon name="cameraOff" size={42} color="white" onClick={toggleCamera} />
              )}
            </button>
            <button className="p-[9px] bg-red-400 rounded-md" onClick={handleClickedCloseButton}>
              <Icon name="power" size={42} color="white" />
            </button>
            <button className="p-[9px] bg-black rounded-md">
              {isMicOn ? (
                <Icon name="microphoneOn" size={42} color="white" onClick={toggleMicrophone} />
              ) : (
                <Icon name="microphoneOff" size={42} color="white" onClick={toggleMicrophone} />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-none z-[101]">
            <div className="flex flex-col px-4 py-safe-offset-6 w-full h-full">
              <div className="flex flex-1 justify-between items-start">
                <video
                  className={"scale-x-[-1] w-[136px] h-[136px] rounded-[8px]"}
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  onPlay={(e) => e.preventDefault()} // 재생 이벤트 무시
                  onPause={(e) => e.preventDefault()} // 일시정지 이벤트 무시
                  onClick={(e) => e.preventDefault()} // 클릭 이벤트 무시
                  style={{ pointerEvents: "none" }}
                />
                <button className="bg-black rounded-full p-[10px]">
                  <Icon name="prohibit" size={25} color="#BFBFBF" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex flex-col w-[50px] y-[130px] py-[13px] px-[9px] gap-[20px] rounded-[30px] items-center bg-black">
                  <button>
                    {isMicOn ? (
                      <Icon name="microphoneOn" size={32} color="#BFBFBF" onClick={toggleMicrophone} />
                    ) : (
                      <Icon name="microphoneOff" size={32} color="#BFBFBF" onClick={toggleMicrophone} />
                    )}
                  </button>
                  <button>
                    {isCameraOn ? (
                      <Icon name="cameraOn" size={32} color="#BFBFBF" onClick={toggleCamera} />
                    ) : (
                      <Icon name="cameraOff" size={32} color="#BFBFBF" onClick={toggleCamera} />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-center items-endflex-1">
                <button className="bg-red-400 rounded-md p-[10px]">
                  <Icon name="power" size={32} color="white" onClick={handleClickedCloseButton} />
                </button>
              </div>
            </div>
          </div>
          <video
            className={"relative scale-x-[-1] h-lvh object-cover"}
            ref={localVideoRef}
            autoPlay
            playsInline
            onPlay={(e) => e.preventDefault()} // 재생 이벤트 무시
            onPause={(e) => e.preventDefault()} // 일시정지 이벤트 무시
            onClick={(e) => e.preventDefault()} // 클릭 이벤트 무시
            style={{ pointerEvents: "none" }}
          ></video>
        </div>
      )}
    </>
  );
};

export default VideoChatPage;

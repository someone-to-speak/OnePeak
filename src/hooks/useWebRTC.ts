"use client";

import { createChannel } from "@/api/supabase/chat";
import { SignalData } from "@/types/chatType/chatType";
import { getDeviceMediaConstraints } from "@/utils/media";
import { useRef } from "react";

export const useWebRTC = (roomId: string) => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  //   const localStream: MediaStream | null = null;
  //   let remoteStream: MediaStream | null = null;
  const channelRef = useRef(createChannel(roomId || ""));

  const setupLessonChannel = async () => {
    if (!channelRef.current) return;

    channelRef.current
      .on("broadcast", { event: "ice-candidate" }, (payload) => handleSignalData(payload as SignalData))
      .on("broadcast", { event: "offer" }, (payload) => handleSignalData(payload as SignalData))
      .on("broadcast", { event: "answer" }, (payload) => handleSignalData(payload as SignalData));
    //   .on("broadcast", { event: "refresh" }, handleRefreshSignal)
    //   .on("broadcast", { event: "back" }, handleBackSignal)
    //   .on("broadcast", { event: "closeMatching" }, handleCloseMatchingSignal);
    channelRef.current.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        console.log("subscribe");
        await init();
      }
    });
  };

  const init = async () => {
    console.log("init");
    if (peerConnection.current) return;

    try {
      // RTCPeerConnection 객체 초기화(구글 STUN 서버)
      const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
      peerConnection.current = new RTCPeerConnection(config);

      // ICE 후보 수집 이벤트 처리
      peerConnection.current.onicecandidate = async (event) => {
        if (event.candidate) {
          await channelRef.current.send({
            type: "broadcast",
            event: "ice-candidate",
            candidate: event.candidate
          });
        }
      };

      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      const { videoConstraints, audioConstraints } = getDeviceMediaConstraints();

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: audioConstraints
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      localStream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, localStream);
      });
    } catch (error) {
      console.error("Failed to initialize WebRTC:", error);
    }
  };

  const createOffer = async () => {
    console.log("createOffer1");
    if (!peerConnection.current) return;
    console.log("createOffer2");
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      await channelRef.current.send({
        type: "broadcast",
        event: "offer",
        sdp: offer
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const handleSignalData = async (payload: SignalData) => {
    if (!peerConnection.current) return;
    console.log("payload ", payload);
    const { event, sdp, candidate } = payload;

    try {
      if (event === "offer" && sdp) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        await channelRef.current.send({
          type: "broadcast",
          event: "answer",
          sdp: answer
        });
      } else if (event === "answer" && sdp) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
      } else if (event === "ice-candidate" && candidate) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error("Error handling signal data:", error);
    }
  };

  return { localVideoRef, remoteVideoRef, setupLessonChannel, createOffer };
};

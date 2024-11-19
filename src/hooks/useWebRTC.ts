"use client";

import { SignalData } from "@/types/chatType/chatType";
import { getDeviceMediaConstraints } from "@/utils/media";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useState, useEffect, useRef, useCallback } from "react";

export const useWebRTC = (roomId: string) => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);

  useEffect(() => {
    console.log("channelRef.current: ", channelRef.current);
    if (channelRef.current) return;
    console.log("webrtc-useEffect");
    const supabase = createClient();
    const channel = supabase.channel(`video-chat-${roomId}`);

    const setupLessonChannel = async () => {
      channel
        .on("broadcast", { event: "ice-candidate" }, (payload) => handleSignalData(payload as SignalData))
        .on("broadcast", { event: "offer" }, (payload) => handleSignalData(payload as SignalData))
        .on("broadcast", { event: "answer" }, (payload) => handleSignalData(payload as SignalData))
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await initializePeerConnection();
          }
        });

      channelRef.current = channel;
    };

    const initializePeerConnection = async () => {
      if (peerConnection.current) return;
      console.log("initializePeerConnection");
      try {
        const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
        peerConnection.current = new RTCPeerConnection(config);

        peerConnection.current.onicecandidate = async (event) => {
          if (event.candidate) {
            await channelRef.current?.send({
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

        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: audioConstraints
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }

        localStream.current.getTracks().forEach((track) => {
          if (localStream.current) peerConnection.current?.addTrack(track, localStream.current);
        });
      } catch (error) {
        console.error("Failed to initialize WebRTC:", error);
      }
    };

    setupLessonChannel();

    return () => {
      console.log("webrtc-cleanup");
      // WebRTC PeerConnection 종료
      if (peerConnection.current) {
        peerConnection.current.close();
      }

      // 로컬 미디어 스트림 정리
      if (localStream.current) {
        const tracks = localStream.current.getTracks();
        tracks.forEach((track) => track.stop()); // 모든 트랙 종료
      }

      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const createOffer = async () => {
    if (!peerConnection.current) return;
    console.log("createOffer");
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      await channelRef.current?.send({
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
    console.log("payload", payload);
    const { event, sdp, candidate } = payload;

    try {
      if (event === "offer" && sdp) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        await channelRef.current?.send({
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

  const toggleCamera = useCallback(() => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  }, []);

  // 마이크 토글
  const toggleMicrophone = useCallback(() => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  }, []);

  return {
    channelRef,
    localVideoRef,
    remoteVideoRef,
    createOffer,
    isCameraOn,
    toggleCamera,
    isMicOn,
    toggleMicrophone
  };
};

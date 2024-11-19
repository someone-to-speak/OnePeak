"use client";

import { SignalData } from "@/types/chatType/chatType";
import { getDeviceMediaConstraints } from "@/utils/media";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

export const useWebRTC = (roomId: string) => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
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

    setupLessonChannel();

    return () => {
      console.log("webrtc-cleanup");
      peerConnection.current?.close();
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

  return { localVideoRef, remoteVideoRef, createOffer };
};

"use client";

import { checkOrAddParticipant, createConversation, insertMessage } from "@/api/supabase/chat";
import { uploadRecording } from "@/api/supabase/record";
import { SignalData } from "@/types/chatType/chatType";
import { getDeviceMediaConstraints } from "@/utils/media";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "./useUser";
import { useRouter } from "next/navigation";

export const useWebRTC = (roomId: string, role: string) => {
  const { userInfo } = useUser();
  const router = useRouter();

  const supabase = createClient();
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);

  const cleanupWebRTC = useCallback(() => {
    console.log("webrtc-cleanup");
    // WebRTC PeerConnection 종료
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // 로컬 미디어 스트림 정리
    if (localStream.current) {
      const tracks = localStream.current.getTracks();
      tracks.forEach((track) => track.stop()); // 모든 트랙 종료
      localStream.current = null;
    }

    // Supabase 채널 제거
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [supabase]);

  // 녹음 종료
  const stopRecording = useCallback(() => {
    return new Promise<Blob | null>((resolve) => {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
          console.log("recordedChunks", recordedChunks);
          const audioBlob = new Blob(recordedChunks.current, { type: "audio/webm" });
          resolve(audioBlob);
        };
      } else {
        resolve(null);
      }
    });
  }, [mediaRecorder, recordedChunks]);

  // 녹음파일 저장
  const saveRecording = useCallback(async () => {
    const localAudioBlob = await stopRecording();
    console.log("localAudioBlob", localAudioBlob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${roomId}_${timestamp}.webm`;

    const url = await uploadRecording(localAudioBlob as Blob, fileName as string);

    await insertMessage(roomId, url as string, "audio");
    await checkOrAddParticipant(roomId, userInfo?.id as string);
  }, [roomId, stopRecording, userInfo?.id]);

  // 화상 통화 종료 시그널 함수
  const handleCloseMatchingSignal = useCallback(async () => {
    await saveRecording();
    router.replace("/lesson");
  }, [saveRecording, router]);

  // 화상 통화 종료
  const close = useCallback(async () => {
    await createConversation(roomId as string);
    await saveRecording();
    router.replace("/lesson");
  }, [roomId, saveRecording, router]);

  const handleleaveAloneSignal = useCallback(async () => {
    alert("사용자와의 연결이 끊어졌습니다.");
    router.replace("/lesson");
  }, [router]);

  useEffect(() => {
    console.log("channelRef.current: ", channelRef.current);
    if (channelRef.current || !role) return;
    console.log("webrtc-useEffect");
    console.log("role: ", role);

    const channel = supabase.channel(`video-chat-${roomId}`);
    let offerTimeoutId: NodeJS.Timeout | null = null;

    const setupLessonChannel = async () => {
      channel
        .on("broadcast", { event: "ice-candidate" }, async (payload) => handleSignalData(payload as SignalData))
        .on("broadcast", { event: "offer" }, async (payload) => handleSignalData(payload as SignalData))
        .on("broadcast", { event: "answer" }, async (payload) => handleSignalData(payload as SignalData))
        .on("broadcast", { event: "closeMatching" }, async () => handleCloseMatchingSignal())
        .on("broadcast", { event: "leaveAlone" }, handleleaveAloneSignal)
        .subscribe(async (status) => {
          console.log("Subscription status:", status);
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
            await channel.send({
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

        await setupLocalStream();

        if (role === "Caller")
          offerTimeoutId = setTimeout(async () => {
            createOffer();
          }, 1500);
      } catch (error) {
        console.error("Failed to initialize WebRTC:", error);
      }
    };

    const setupLocalStream = async () => {
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

      const audioOnlyStream = new MediaStream(localStream.current.getAudioTracks());
      console.log("Audio Tracks:", audioOnlyStream.getAudioTracks());
      const recorder = new MediaRecorder(audioOnlyStream);
      mediaRecorder.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("event: ", event);
          recordedChunks.current.push(event.data);
        }
      };

      recorder.start();
      console.log("Recorder started:", recorder.state);
    };

    const createOffer = async () => {
      if (!peerConnection.current) return;
      console.log("createOffer");
      try {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        await channel.send({
          type: "broadcast",
          event: "offer",
          sdp: offer
        });
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    };

    setupLessonChannel();

    return () => {
      if (offerTimeoutId) {
        clearTimeout(offerTimeoutId);
      }

      cleanupWebRTC();
    };
  }, [cleanupWebRTC, handleCloseMatchingSignal, handleleaveAloneSignal, supabase, role, roomId]);

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
    isCameraOn,
    toggleCamera,
    isMicOn,
    toggleMicrophone,
    close
  };
};

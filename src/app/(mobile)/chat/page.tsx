"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type SignalData = {
  event: "offer" | "answer" | "ice-candidate";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

const VideoChat: React.FC = () => {
  const supabase = createClient();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const signalingChannel = supabase.channel("video-chat");
    setChannel(signalingChannel);

    signalingChannel
      .on("broadcast", { event: "webrtc-signal" }, () => handleSignalData)
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Connected to signaling channel");
          initWebRTC();
        }
      });

    return () => {
      signalingChannel.unsubscribe();
      peerConnectionRef.current?.close();
    };
  }, []);

  const initWebRTC = async () => {
    const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    const peerConnection = new RTCPeerConnection(config);
    peerConnectionRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        channel?.send({ type: "broadcast", event: "ice-candidate", candidate: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
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
  };

  const handleSignalData = async (payload: SignalData) => {
    if (!peerConnectionRef.current) return;

    const { event, sdp, candidate } = payload;

    if (event === "offer" && sdp) {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      channel?.send({ type: "broadcast", event: "answer", sdp: answer });
    } else if (event === "answer" && sdp) {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    } else if (event === "ice-candidate" && candidate) {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const createOffer = async () => {
    if (!peerConnectionRef.current) return;

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    channel?.send({ type: "broadcast", event: "offer", sdp: offer });
  };

  return (
    <div>
      <h1>1:1 화상 채팅</h1>
      <div>
        <video className="w-[300px] aspect-video" ref={localVideoRef} autoPlay playsInline muted />
        <video className="w-[300px] aspect-video" ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <button onClick={createOffer}>Start Call</button>
    </div>
  );
};

export default VideoChat;

"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type SignalData = {
  event: "offer" | "answer" | "ice-candidate";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

const VideoChat = () => {
  console.log("VideoChat");
  const supabase = createClient();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null);
  const tChannel = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const signalingChannel = supabase.channel("video-chat", {
      config: {
        broadcast: { ack: true }
      }
    });
    setChannel(signalingChannel);
    signalingChannel
      .on("broadcast", { event: "ice-candidate" }, (payload: SignalData) => handleSignalData(payload))
      .on("broadcast", { event: "offer" }, (payload: SignalData) => handleSignalData(payload))
      .on("broadcast", { event: "answer" }, (payload: SignalData) => handleSignalData(payload))
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Connected to signaling channel");

          initWebRTC();
        } else if (status === "CHANNEL_ERROR") {
          console.log("CHANNEL_ERROR");
        } else if (status === "CLOSED") {
          console.log("CLOSED");
        } else if (status === "TIMED_OUT") {
          console.log("TIMED_OUT");
        }
      });

    // tChannel.current = signalingChannel;

    return () => {
      channel?.unsubscribe();
      peerConnectionRef.current?.close();
    };
  }, []);

  const initWebRTC = async () => {
    const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    const peerConnection = new RTCPeerConnection(config);
    peerConnectionRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      // console.log("onicecandidate event: :", event);
      if (event.candidate) {
        // console.log("send candidate");
        channel?.send({
          type: "broadcast",
          event: "ice-candidate",
          candidate: event.candidate
        });
      }
    };

    peerConnection.ontrack = (event) => {
      // console.log("ontrack");
      if (remoteVideoRef.current) {
        // console.log("peerConnection: ", peerConnection);
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("Connection State:", peerConnection.connectionState);
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", peerConnection.iceConnectionState);
    };

    peerConnection.onicegatheringstatechange = () => {
      console.log("ICE Gathering State:", peerConnection.iceGatheringState);
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
    try {
      if (!peerConnectionRef.current) return;
      console.log("payload: ", payload);
      const { event, sdp, candidate } = payload;
      console.log("sdp: ", sdp);
      if (event === "offer" && sdp) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        // console.log("channel: ", channel);
        const serverResponse = channel?.send({
          type: "broadcast",
          event: "answer",
          sdp: answer
        });
        console.log("serverResponse: ", serverResponse);
      } else if (event === "answer" && sdp) {
        console.log("answer");
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      } else if (event === "ice-candidate" && candidate) {
        console.log("candidate");
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
      console.log("end");
    } catch (error) {
      console.error("Error handling signal data:", error);
    }
  };

  // const handleOfferSignal = async (payload: SignalData) => {
  //   if (!peerConnectionRef.current) return;
  //   console.log("payload: ", payload);
  //   const { sdp } = payload;
  //   if (sdp?.sdp) {
  //     await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
  //     const answer = await peerConnectionRef.current.createAnswer();
  //     console.log("answer: ", answer);
  //     await peerConnectionRef.current.setLocalDescription(answer);
  //     const serverResponse = channel?.send({ type: "broadcast", event: "answer", payload: { sdp: answer } });
  //     console.log("serverResponse: ", serverResponse);
  //   }
  // };

  // const handleAnswerSignal = async (payload: SignalData) => {
  //   if (!peerConnectionRef.current) return;

  //   const { sdp } = payload;
  //   if (sdp) {
  //     await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
  //   }
  // };

  // const handleCandidateSignal = async (payload: SignalData) => {
  //   if (!peerConnectionRef.current) return;

  //   const { candidate } = payload;
  //   if (candidate) await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  // };

  const createOffer = async () => {
    if (!peerConnectionRef.current) {
      console.log("not found peerConnectionRef");
      return;
    }

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    const serverResponse = channel?.send({
      type: "broadcast",
      event: "offer",
      sdp: offer
    });
    console.log("serverResponse: ", serverResponse);
    // console.log("re channel: ", channel);
  };

  return (
    <div>
      <h1>1:1 화상 채팅</h1>
      <button onClick={createOffer}>Start Call</button>

      <div className="flex flex-col h-auto">
        <video ref={remoteVideoRef} autoPlay />
        <video ref={localVideoRef} autoPlay />
      </div>
    </div>
  );
};

export default VideoChat;

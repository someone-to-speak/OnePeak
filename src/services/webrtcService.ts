import { RealtimeChannel } from "@supabase/supabase-js";

export type SignalData = {
  event: "offer" | "answer" | "ice-candidate" | "leave";
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localVideoRef: React.RefObject<HTMLVideoElement>;
  private remoteVideoRef: React.RefObject<HTMLVideoElement>;
  private channel: RealtimeChannel;

  constructor(
    localVideoRef: React.RefObject<HTMLVideoElement>,
    remoteVideoRef: React.RefObject<HTMLVideoElement>,
    channel: RealtimeChannel
  ) {
    this.localVideoRef = localVideoRef;
    this.remoteVideoRef = remoteVideoRef;
    this.channel = channel;
  }

  async init() {
    const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    this.peerConnection = new RTCPeerConnection(config);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.channel.send({
          type: "broadcast",
          event: "ice-candidate",
          candidate: event.candidate
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      if (this.remoteVideoRef.current) {
        this.remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (this.localVideoRef.current) {
      this.localVideoRef.current.srcObject = localStream;
    }
    localStream.getTracks().forEach((track) => {
      this.peerConnection?.addTrack(track, localStream);
    });
  }

  async createOffer() {
    if (!this.peerConnection) return;

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.channel.send({
      type: "broadcast",
      event: "offer",
      sdp: offer
    });
  }

  async handleSignalData(payload: SignalData) {
    if (!this.peerConnection) return;
    const { event, sdp, candidate } = payload;

    if (event === "offer" && sdp) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.channel.send({
        type: "broadcast",
        event: "answer",
        sdp: answer
      });
    } else if (event === "answer" && sdp) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
    } else if (event === "ice-candidate" && candidate) {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  closeConnection() {
    this.peerConnection?.close();
  }
}

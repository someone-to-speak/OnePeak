import { SignalData } from "@/types/chatType/chatType";
import { RealtimeChannel } from "@supabase/supabase-js";

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localVideoRef: React.RefObject<HTMLVideoElement>;
  private remoteVideoRef: React.RefObject<HTMLVideoElement>;
  private channel: RealtimeChannel;
  private localStream: MediaStream | null = null;
  private localMediaRecorder: MediaRecorder | null = null;
  private localAudioChunks: Blob[] = [];

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

    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await this.channel.send({
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

    const videoConstraints = {
      width: { ideal: 640 },
      height: { ideal: 360 },
      frameRate: { max: 20 }
    };

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: {
        sampleRate: 16000
      }
    });
    this.localStream = localStream;
    if (this.localVideoRef.current) {
      this.localVideoRef.current.srcObject = localStream;
    }

    localStream.getTracks().forEach((track) => {
      this.peerConnection?.addTrack(track, localStream);
    });

    this.startLocalRecording(localStream);
  }

  private startLocalRecording(stream: MediaStream) {
    const audioOnlyStream = new MediaStream(stream.getAudioTracks());
    this.localMediaRecorder = new MediaRecorder(audioOnlyStream);
    this.localMediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.localAudioChunks.push(event.data);
    };
    this.localMediaRecorder.start();
  }

  async stopRecording() {
    return new Promise<Blob>((resolve, reject) => {
      if (!this.localMediaRecorder) {
        reject("No media recorder available");
        return;
      }

      this.localMediaRecorder.onstop = () => {
        if (this.localAudioChunks.length > 0) {
          const localAudioBlob = new Blob(this.localAudioChunks, { type: "audio/webm" });
          resolve(localAudioBlob);
        } else {
          reject("No audio data captured");
        }
      };

      this.localMediaRecorder.stop();
    });
  }

  async createOffer() {
    if (!this.peerConnection) return;

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    await this.channel.send({
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
      await this.channel.send({
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

  async closeConnection() {
    this.peerConnection?.close();
    this.localStream?.getTracks().forEach((track) => track.stop());
  }
}

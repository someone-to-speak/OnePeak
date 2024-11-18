import { useState, useEffect, useRef } from "react";
import { convertSpeechToText } from "@/utils/chatbot/chatBotApi";
import RecordRTC from "recordrtc";

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      if (typeof window === "undefined") return;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000
        }
      });

      streamRef.current = stream;

      const { default: RecordRTC, StereoAudioRecorder } = await import("recordrtc");

      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        timeSlice: 1000
      });

      recorderRef.current = recorder;
      recorder.startRecording();
      setIsRecording(true);
    } catch (error) {
      setIsRecording(false);
      throw error;
    }
  };

  const stopRecording = async (): Promise<string> => {
    if (!recorderRef.current || !isRecording) return "";

    return new Promise((resolve) => {
      recorderRef.current!.stopRecording(async () => {
        try {
          const blob = recorderRef.current?.getBlob();
          if (!blob || blob.size < 1000) {
            resolve("");
            return;
          }

          const audioFile = new File([blob], "audio.wav", {
            type: "audio/wav"
          });

          const text = await convertSpeechToText(audioFile);
          resolve(text && text.trim() && !text.includes("MBC 뉴스") ? text : "");
        } catch {
          resolve("");
        } finally {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          recorderRef.current = null;
          setIsRecording(false);
        }
      });
    });
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
    };
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};

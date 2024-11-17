import { useState, useEffect, useRef } from "react";
import { convertSpeechToText } from "@/utils/chatbot/chatBotApi";
import RecordRTC from "recordrtc";

export const useAudioRecorder = (callback: (text: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const checkEnvironment = () => {
    if (typeof window === "undefined") return { isIOS: false, isSafari: false };
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    return { isIOS, isSafari };
  };

  const startRecording = async () => {
    try {
      if (typeof window === "undefined") {
        callback("브라우저 환경이 아닙니다.");
        return;
      }

      const { isIOS, isSafari } = checkEnvironment();
      callback(`환경체크: ${isIOS ? "iOS" : "다른 OS"}, ${isSafari ? "Safari" : "다른 브라우저"}`);

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
      callback("녹음이 시작되었습니다.");
    } catch (error) {
      if (error instanceof Error) {
        callback(`마이크 접근 오류: ${error.message}`);
      } else {
        callback("마이크 접근에 실패했습니다. 브라우저 권한을 확인해주세요.");
      }
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current || !isRecording) return;

    callback("녹음을 중지합니다...");

    recorderRef.current.stopRecording(async () => {
      try {
        const blob = recorderRef.current?.getBlob();
        if (!blob) {
          callback("녹음 데이터를 가져올 수 없습니다.");
          return;
        }

        if (blob.size < 1000) {
          callback("녹음된 내용이 너무 짧습니다. 다시 시도해주세요.");
          return;
        }

        const audioFile = new File([blob], "audio.wav", {
          type: "audio/wav"
        });

        callback("음성을 텍스트로 변환 중...");
        const text = await convertSpeechToText(audioFile);

        if (text && text.trim() && !text.includes("MBC 뉴스")) {
          callback(text);
        } else {
          callback("음성 인식에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        callback(`음성 변환 중 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
      } finally {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        recorderRef.current = null;
        setIsRecording(false);
      }
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

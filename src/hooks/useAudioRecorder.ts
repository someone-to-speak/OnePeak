import { AudioRecorderState } from "@/app/types/chatBotType/chatBotType";
import { convertSpeechToText } from "@/utils/chatbot/chatBotApi";
import { useState } from "react";

export const useAudioRecorder = (callback: (text: string) => void) => {
  const [recorderState, setRecorderState] = useState<AudioRecorderState>({
    isRecording: false,
    mediaRecorder: null,
    chunks: []
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000
        }
      });

      // 브라우저가 지원하는 mimeType 확인
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";

      // 오디오 형식을 명시적으로 지정
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunks, { type: mimeType });

          // 오디오 길이/크기 체크 (1KB 미만이면 무시)
          if (audioBlob.size < 1000) {
            throw new Error("녹음된 내용이 너무 짧습니다.");
            // return;
          }

          const audioFile = new File([audioBlob], "audio.webm", { type: mimeType });
          const text = await convertSpeechToText(audioFile);

          // 버그 처리
          if (text.includes("MBC 뉴스 이덕영입니다")) {
            // throw new Error("유효하지 않은 음성 인식 결과");
            return;
          }

          callback(text);
        } catch (error) {
          console.log("음성 변환 실패: ", error);
          throw error;
        } finally {
          // 스트림 정지
          mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start(1000);
      setRecorderState({
        isRecording: true,
        mediaRecorder,
        chunks
      });
    } catch (error) {
      console.log("마이크 접근 실패: ", error);
      // throw error;
      // 에러 발생 시 상태 초기화
      setRecorderState({
        isRecording: false,
        mediaRecorder: null,
        chunks: []
      });
    }
  };

  // 음성 녹음 중지
  const stopRecording = () => {
    if (recorderState.mediaRecorder && recorderState.isRecording) {
      recorderState.mediaRecorder.stop();
      setRecorderState((prev) => ({ ...prev, isRecording: false }));
    }
  };
  return {
    isRecording: recorderState.isRecording,
    startRecording,
    stopRecording
  };
};

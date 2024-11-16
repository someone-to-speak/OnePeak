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
      console.log("1. 녹음 시작 전 상태: ", recorderState.isRecording);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000
        }
      });
      console.log("2. 스트림 획득 성공");

      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      console.log("3. 선택된 mimeType: ", mimeType);

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      console.log("4. MediaRecorder 생성됨");

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        console.log("5. 데이터 수집됨, 크기: ", e.data.size);
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunks, { type: mimeType });
          console.log("6. 생성된 Blob 크기:", audioBlob.size);

          // 오디오 길이/크기 체크 (1KB 미만이면 에러)
          if (audioBlob.size < 1000) {
            callback("녹음된 내용이 너무 짧습니다. 다시 시도해주세요.");
            return;
          }

          const audioFile = new File([audioBlob], "audio.webm", { type: mimeType });
          const text = await convertSpeechToText(audioFile);
          console.log("7. 변환된 텍스트:", text);

          // 버그 처리
          if (text.includes("MBC 뉴스 이덕영입니다")) {
            callback("음성 인식에 실패했습니다. 다시 시도해주세요.");
            return;
          }

          // 정상적인 텍스트인 경우에만 콜백 호출
          if (text && text.trim()) {
            callback(text);
          } else {
            callback("음성을 텍스트로 변환하지 못했습니다. 다시 시도해주세요.");
          }
        } catch (error) {
          console.error("음성 변환 실패: ", error);
          callback("음성 변환 중 오류가 발생했습니다. 다시 시도해주세요.");
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
      console.error("마이크 접근 실패: ", error);
      callback("마이크 접근에 실패했습니다. 브라우저 권한을 확인해주세요.");
      setRecorderState({
        isRecording: false,
        mediaRecorder: null,
        chunks: []
      });
    }
  };

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

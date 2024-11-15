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
      // console.log("1. 녹음 시작 시도");
      // alert("녹음을 시작합니다.");
      if (recorderState.isRecording) {
        alert("이미 녹음 중입니다!");
        return;
      }
      alert("녹음을 시작합니다. 현재 상태: " + recorderState.isRecording);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000
        }
      });

      alert("마이크 권한 획득 성공");

      // 브라우저가 지원하는 mimeType 확인
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      console.log("4. 브라우저가 지원하는 mimeType: ", mimeType);
      alert(`지원하는 mimeType: ${mimeType}`);

      // 오디오 형식을 명시적으로 지정
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      console.log("5. mediaRecorder 생성 성공: ", mediaRecorder);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        console.log("6. 데이터 수집: ", e.data.size, "bytes");
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunks, { type: mimeType });
          console.log("7. 생성된 Blob 크기: ", audioBlob.size, "bytes");

          // 오디오 길이/크기 체크 (1KB 미만이면 무시)
          if (audioBlob.size < 1000) {
            throw new Error("녹음된 내용이 너무 짧습니다.");
            // return;
          }

          const audioFile = new File([audioBlob], "audio.webm", { type: mimeType });
          console.log("9. 파일 생성 완료", audioFile.size);
          const text = await convertSpeechToText(audioFile);

          // 버그 처리
          if (text.includes("MBC 뉴스 이덕영입니다")) {
            // throw new Error("유효하지 않은 음성 인식 결과");
            return;
          }

          callback(text);
        } catch (error) {
          console.log("음성 변환 실패: ", error);
          alert(`에러 발생: ${error}`);
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
      alert("녹음 시작 완료. 상태 업데이트 후: true");
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
    alert("녹음 중지 시도. 현재 상태: " + recorderState.isRecording);
    if (recorderState.mediaRecorder && recorderState.isRecording) {
      recorderState.mediaRecorder.stop();
      setRecorderState((prev) => ({ ...prev, isRecording: false }));
      alert("녹음 중지 완료");
    }
  };
  return {
    isRecording: recorderState.isRecording,
    startRecording,
    stopRecording
  };
};

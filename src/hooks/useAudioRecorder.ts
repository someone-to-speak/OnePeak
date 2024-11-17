import { AudioRecorderState } from "@/app/types/chatBotType/chatBotType";
import { convertSpeechToText } from "@/utils/chatbot/chatBotApi";
import { useState, useEffect } from "react";

export const useAudioRecorder = (callback: (text: string) => void) => {
  const [recorderState, setRecorderState] = useState<AudioRecorderState>({
    isRecording: false,
    mediaRecorder: null,
    chunks: []
  });

  // 브라우저 및 모바일 환경 체크
  const checkEnvironment = () => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    return { isSafari, isIOS };
  };

  // 오디오 제약조건 설정
  const getAudioConstraints = () => {
    const { isIOS, isSafari } = checkEnvironment();

    const baseConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    };

    // iOS Safari에 대한 특별 처리
    if (isIOS || isSafari) {
      return {
        ...baseConstraints,
        sampleRate: 44100, // iOS는 보통 44.1kHz를 선호
        channelCount: 1
      };
    }

    return {
      ...baseConstraints,
      sampleRate: 16000,
      channelCount: 1
    };
  };

  const startRecording = async () => {
    try {
      const { isIOS, isSafari } = checkEnvironment();
      console.log("환경 체크:", { isIOS, isSafari });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: getAudioConstraints()
      });

      // MIME 타입 설정
      let mimeType = "audio/webm";
      if (isIOS || isSafari) {
        mimeType = "audio/wav";
      }

      // MediaRecorder 옵션 설정
      const options = {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : "audio/webm",
        audioBitsPerSecond: isIOS ? 64000 : 128000 // iOS에서 더 낮은 비트레이트 사용
      };

      const mediaRecorder = new MediaRecorder(stream, options);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunks, { type: options.mimeType });

          // 최소 녹음 길이 체크 (500ms)
          if (audioBlob.size < 1000) {
            callback("녹음된 내용이 너무 짧습니다. 다시 시도해주세요.");
            return;
          }

          const audioFile = new File([audioBlob], `audio.${isIOS ? "wav" : "webm"}`, {
            type: options.mimeType
          });

          // 디버그용 오디오 재생 체크 (옵션)
          // const audioUrl = URL.createObjectURL(audioBlob);
          // const audio = new Audio(audioUrl);
          // audio.play();

          const text = await convertSpeechToText(audioFile);

          if (text && text.trim() && !text.includes("MBC 뉴스")) {
            callback(text);
          } else {
            callback("음성 인식에 실패했습니다. 다시 시도해주세요.");
          }
        } catch (error) {
          console.error("음성 변환 실패:", error);
          callback("음성 변환 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
          mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        }
      };

      // 타임슬라이스를 더 작게 설정 (모바일 최적화)
      mediaRecorder.start(500);
      setRecorderState({
        isRecording: true,
        mediaRecorder,
        chunks
      });
    } catch (error) {
      console.error("마이크 접근 실패:", error);
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        callback("마이크 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.");
      } else {
        callback("마이크 접근에 실패했습니다. 브라우저 권한을 확인해주세요.");
      }
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

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (recorderState.mediaRecorder) {
        recorderState.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [recorderState.mediaRecorder]);

  return {
    isRecording: recorderState.isRecording,
    startRecording,
    stopRecording
  };
};

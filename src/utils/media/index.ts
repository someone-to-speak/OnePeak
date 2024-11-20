export const getDeviceMediaConstraints = () => {
  // 사용자 에이전트를 기반으로 디바이스를 판별
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const videoConstraints = {
    width: { ideal: 720 },
    height: { ideal: 1280 },
    frameRate: { ideal: isMobile ? 30 : 60, max: 60 }, // 모바일에서는 30fps, 데스크탑은 60fps까지 허용
    aspectRatio: { ideal: 9 / 16 } // 세로 화면 비율
  };

  const audioConstraints = {
    channelCount: 1, // 기본적으로 모노 채널
    sampleRate: isMobile ? 16000 : 44100 // 모바일에서는 샘플레이트 낮추기
  };

  return { videoConstraints, audioConstraints };
};

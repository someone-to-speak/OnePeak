export const convertTextToSpeech = async (text: string) => {
  if (!text) return ""; // 변환할 텍스트가 없으면 빈 문자열 반환

  // 서버의 API 엔드포인트에 요청을 보내 텍스트를 음성으로 변환
  const response = await fetch("/api/textToSpeech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json" // JSON 데이터 전송을 명시
    },
    body: JSON.stringify({ text }) // 요청 본문에 텍스트 데이터를 포함
  });
  // 서버에서 반환된 Base64로 인코딩된 음성 데이터를 추출
  const { buffer } = await response.json();
  // Base64 형식의 음성 데이터를 반환
  return buffer;
};

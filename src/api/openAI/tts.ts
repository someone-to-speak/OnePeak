export const convertTextToSpeech = async (text: string) => {
  if (!text) return "";
  const response = await fetch("/api/textToSpeech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });
  const { buffer } = await response.json();
  return buffer;
};

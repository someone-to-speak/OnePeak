export const convertSpeechToText = async (url: string) => {
  const response = await fetch("/api/speechToText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url: url })
  });
  const data = await response.json();
  return data.text;
};

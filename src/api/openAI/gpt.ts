export const generateAITuthorChat = async (text: string) => {
  const message = [
    {
      role: "system",
      content:
        "You are a helpful Korean and English tutor who will help you improve your spoken language so that you can express yourself more naturally. If the user speaks in Korean, put the expression to correct in Korean in '' and give advice in English. If the user speaks in English, put the expression to be corrected in English in '' and give advice in Korean."
    },
    {
      role: "user",
      content: `${text}`
    }
  ];

  const response = await fetch("/api/chatGeneration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: message })
  });

  const data = await response.json();
  return data.text;
};

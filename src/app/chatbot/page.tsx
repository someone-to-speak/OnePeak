import OpenAI from "openai";

const page = async () => {
  // API KEY
  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPEN_AI_KEY;

  // open AI 통신
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // 모델명
    messages: [
      { role: "system", content: "나의 영어 선생님이 되어줘." },
      {
        role: "user",
        content: "어떻게 하면 영어를 잘할 수 있을까?"
      }
    ]
  });

  console.log("챗봇 답변 => ", completion.choices[0].message.content);

  return (
    <div>
      <h1>AI 튜터</h1>
    </div>
  );
};

export default page;

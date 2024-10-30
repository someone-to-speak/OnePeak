import OpenAI from "openai";
import React from "react";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const Page = async () => {
  const text = "나 갈게 너집안으로";
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful Korean and English tutor who will help you improve your spoken language so that you can express yourself more naturally. If the user speaks in Korean, put the expression to correct in Korean in '' and give advice in English. If the user speaks in English, put the expression to be corrected in English in '' and give advice in Korean."
      },
      {
        role: "user",
        content: `${text}`
      }
    ]
  });

  const result = completion.choices[0].message.content;
  // console.log(completion.choices[0].message);

  return <>{result}</>;
};

export default Page;

// const getAIData = async () => {
//   const data = await fetch(`/api/getSuggestion`);
//   const result = await data?.json();
//   console.log("result", result);
//   return result;
// };
// getAIData();

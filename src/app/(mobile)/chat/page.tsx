import OpenAI from "openai";
import React from "react";

// const getAIData = async () => {
//   const data = await fetch(`/api/getSuggestion`);
//   const result = await data?.json();
//   console.log("result", result);
//   return result;
// };
// getAIData();

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

const Page = async () => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that improves phrasing for spoken language to make it sound more natural."
      },
      {
        role: "user",
        content: "나를 장난감 사라졌어"
      }
    ]
  });

  console.log(completion.choices[0].message);
  return <div>page</div>;
};

export default Page;

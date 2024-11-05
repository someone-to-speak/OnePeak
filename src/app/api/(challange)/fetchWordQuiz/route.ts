import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

const OPENAI_API_KEY = process.env.OPEN_AI_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export async function POST(req: Request) {
  const supabase = createClient();
  const { type, language, length } = await req.json();

  if (!type || !language || !length) {
    return NextResponse.json({ error: "문제 유형, 난이도 및 언어가 필요합니다." }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Create a word test that meets the following requirements:
          - Note: Please adhere to the specified response format! Create a difficult & unique vocabulary quiz where, if the question is in English, the English word is given and the Korean word is the answer, and if the question is in Korean, the English word is the answer.
          - number of questions: add 8 questions.
          - type: word
          - reason: Please create reason in Korean.
          - language: korean, english
          - Response Format: [ { "content": {quiz of vocabulary}, "answer": {answer of quiz}, "wrong_answer": {wrong_answer}, "reason": {reason of quiz}, "language": {language of question}, "type": {always word} }]`
        }
      ]
    });

    if (!completion.choices.length) {
      throw new Error("응답이 없습니다.");
    }

    const responseContent = completion.choices[0].message.content;
    console.log(responseContent);
    // 응답 내용이 없거나 유효한 JSON이 아닌 경우 처리
    if (!responseContent) {
      throw new Error("응답 내용이 없습니다.");
    }

    const parsedResponse = JSON.parse(responseContent);

    if (!Array.isArray(parsedResponse)) {
      throw new Error("응답 형식이 올바르지 않습니다.");
    }

    const { data, error } = await supabase.from("questions").insert(parsedResponse);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("API 호출 실패:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

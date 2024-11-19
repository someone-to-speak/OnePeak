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
          content: `Create a fill-in-the-blank problem that meets the following requirements:
- Note: Please adhere to the specified response format! The problem must be a logically sound and indisputable question. The 'content' should only contain the fill-in-the-blank problem. It should be a blank-fill question that does not include any hints or meanings of the answer within the sentence. Generate a one-line ( example: _____ ) fill-in-the-blank question. The sentence should not hint at the answer. It should be a problem that can only be inferred in one line, without any context. Do not include any multiple-choice expressions that could provide hints within the sentence. Example: Yesterday, I went to the library and _____ read a book.
- number of questions: add 8 questions.
- type: grammar
- reason: The explanation for the quiz should always be in Korean. 
- language: Korean, English
- Response Format: [ { "content": {quiz of fill-in-the-blank}, "answer": {answer of quiz}, "wrong_answer": {two wrong_answer}, "reason": {reason of quiz (always in Korean)}, "language": {language of question}, "type": {always grammar} }]`
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

    // Supabase에 데이터 삽입
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

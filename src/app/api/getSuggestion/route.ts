import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that improves phrasing for spoken English to make it sound more natural."
        },
        { role: "user", content: `Here's what was spoken: "${text}". How could this be phrased more naturally?` }
      ],
      max_tokens: 100
    });

    const suggestion = response.choices[0].message?.content;
    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error generating suggestion" }, { status: 500 });
  }
}

import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

const supabase = createClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("wrong_answers").select("*").eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { id, user_id } = await request.json();

  if (!id || !user_id) {
    return NextResponse.json({ error: "id and user_id are required" }, { status: 400 });
  }

  const { error } = await supabase.from("wrong_answers").delete().match({ id, user_id });

  if (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  return NextResponse.json({}, { status: 204 }); // No Content
}

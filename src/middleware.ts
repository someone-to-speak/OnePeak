import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "./utils/supabase/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //tanstack써서 쿼리키에 userid적어서 바뀌게
  //url 노출이 필요하나?
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const userId = data?.session?.user?.id;
  await fetch("");
  if (isBlocked) {
    return NextResponse.rewrite(new URL("/myPage/faq", request.url));
  }
}

//어떤 페이지에서 middleware 함수를 실행시킬지 결정
export const config = {
  //   matcher: "/"
};

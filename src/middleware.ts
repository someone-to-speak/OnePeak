import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserServer } from "./api/supabase/getUserServer";
import { UserInfo } from "./types/userType/userType";

// 차단된 사용자일 경우 리디렉션 처리
const redirectIfBlocked = (data: UserInfo, request: NextRequest) => {
  const isBlocked = data?.is_blocked === true;
  const isPathProtected = ["/challenge", "/lesson", "/chat", "/"].some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  );
  const startWithFaq = request.nextUrl.pathname.startsWith("/myPage/faq");

  if (isBlocked && isPathProtected && !startWithFaq) {
    return NextResponse.redirect(new URL("/myPage/faq", request.url));
  }
};

// 인증되지 않은 사용자에 대한 접근 차단
const redirectIfUnauthenticated = (data: UserInfo, request: NextRequest) => {
  const isAuthenticated = data !== null;
  const isPathProtected = ["/myPage", "/challenge", "/lesson", "/chat"].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isAuthenticated && isPathProtected) {
    return NextResponse.rewrite(new URL("/", request.url));
  }
};

// 미들웨어 함수
export async function middleware(request: NextRequest) {
  const data = await getUserServer();
  console.log("User data:", data);
  console.log("Request Pathname:", request.nextUrl.pathname);

  // 차단된 사용자 리디렉션
  const blockedResponse = redirectIfBlocked(data, request);
  if (blockedResponse) {
    return blockedResponse;
  }

  // 인증되지 않은 사용자 리디렉션
  const unauthenticatedResponse = redirectIfUnauthenticated(data, request);
  if (unauthenticatedResponse) {
    return unauthenticatedResponse;
  }

  return NextResponse.next();
}

// 어떤 페이지에서 미들웨어 함수를 실행할지 정의
export const config = {
  matcher: ["/myPage/:path*", "/challenge/:path*", "/lesson/:path*", "/chat/:path*", "/"]
};

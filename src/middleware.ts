// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { createClient } from "./utils/supabase/server";
// import { useQuery } from "@tanstack/react-query";

// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   //tanstack써서 쿼리키에 userid적어서 바뀌게
// const {data, isPending, isError} = useQuery(
//     {
//         queryKey: ['targetUserInfo'],
//         queryFn: () =>getUserSer
//     }
// )

//   await fetch("");
//   if (isBlocked) {
//     return NextResponse.rewrite(new URL("/myPage/faq", request.url));
//   }
// }

// //어떤 페이지에서 middleware 함수를 실행시킬지 결정
// export const config = {
//   //   matcher: "/"
// };

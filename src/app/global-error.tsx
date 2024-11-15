"use client";

import { Typography } from "@/components/ui/typography";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body>
        <div className="h-screen w-screen flex justify-center items-center">
          <Typography size={16} weight={"bold"}>
            예기치 못한 오류가 발생하였습니다.
          </Typography>
          <button onClick={() => reset()}>재요청하기</button>
        </div>
      </body>
    </html>
  );
}

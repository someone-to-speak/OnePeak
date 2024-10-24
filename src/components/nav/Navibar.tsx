import Link from "next/link";

const Navibar = () => {
  return (
    <div className="relative z-[200]">
      <div
        className="w-full min-w-[320px] max-w-[600px] mx-auto my-0 px-4 py-0 pb-safe-offset-0 fixed left-0 right-0 bottom-0 bg-white
      border-[1px] border-solid border-rgba(138, 138, 138, .1) box-border flex gap-[12px] text-black"
      >
        <Link
          href={"/"}
          className="flex flex-col items-center h-[55px] font-semibold text-[11px] basis-1/5 decoration-inherit"
        >
          AI 튜터
        </Link>
        <Link
          href={"/lesson"}
          className="flex flex-col items-center h-[55px] font-semibold text-[11px] basis-1/5 decoration-inherit"
        >
          언어 수업
        </Link>
        <Link
          href={"/chat"}
          className="flex flex-col items-center h-[55px] font-semibold text-[11px] basis-1/5 decoration-inherit"
        >
          채팅방
        </Link>
        <Link
          href={"/challenge"}
          className="flex flex-col items-center h-[55px] font-semibold text-[11px] basis-1/5 decoration-inherit"
        >
          챌린지
        </Link>
        <Link
          href={"/myPage"}
          className="flex flex-col items-center h-[55px] font-semibold text-[11px] basis-1/5 decoration-inherit"
        >
          내 정보
        </Link>
      </div>
    </div>
  );
};

export default Navibar;

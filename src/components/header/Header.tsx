import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full sticky min-w-[320px] max-w-[600px] top-0 left-0 right-0 mx-auto mt-0">
      <div className="flex items-center justify-between box-border px-4 h-[52px] bg-blue-200">
        <div className="flex justify-center items-center w-[28px] h-[28px] bg-white">로고</div>
        <div className="flex justify-center items-center ml-auto gap-2">
          <Link href={"/login"}>로그인</Link>
          <Link href={"/signUp"}>회원가입</Link>
          <>출석</>
          <>알림</>
        </div>
      </div>
    </header>
  );
};

export default Header;

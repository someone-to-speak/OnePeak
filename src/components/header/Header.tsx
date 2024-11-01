"use client";

import { getUser, signInWithProvider, signOut } from "@/services/supabaseAuth";
import { useEffect, useState } from "react";

const Header = () => {
  const [name, setName] = useState<string>("");

  const handleSignInWithGoogle = async () => {
    await signInWithProvider("google");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // 테스트 로직
  useEffect(() => {
    const checkUser = async () => {
      const name: string = await getUser();
      setName(name);
    };

    checkUser();
  }, []);

  return (
    <header className="w-full sticky min-w-[320px] max-w-[600px] top-0 left-0 right-0 mx-auto mt-0">
      <div className="flex items-center justify-between box-border px-4 h-[52px] bg-blue-200">
        <div className="flex justify-center items-center w-[28px] h-[28px] bg-white">로고</div>
        <div className="flex justify-center items-center ml-auto gap-2">
          <span>{name}</span>
          <button onClick={handleSignInWithGoogle}>구글 로그인</button>
          <button onClick={handleSignOut}>로그아웃</button>
          <>출석</>
          <>알림</>
        </div>
      </div>
    </header>
  );
};

export default Header;

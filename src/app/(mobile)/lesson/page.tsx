"use client";

import React from "react";
import { useMatching } from "@/hooks/useMatching";
import { redirect } from "next/navigation";
import img1 from "@/../public/images/book.jpg";
import Image from "next/image";

const LessonPage = () => {
  const { setupMatchingChannel, userInfo, isLoading, isError } = useMatching();
  const handleClickMachingButton = () => {
    if (!userInfo) {
      alert("로그인 후 이용이 가능합니다.");
    }

    setupMatchingChannel();
  };

  if (isLoading) {
    return <div>잠시만 기다려주세요...</div>;
  }

  if (isError) {
    alert("예기치 못한 오류가 발생하였습니다.");
    redirect("/");
  }

  return (
    <>
      <h1>언어수업</h1>
      <Image src={img1} alt={"Image1"} />
      <p>학습언어 : {userInfo?.learn_language}</p>
      <button onClick={handleClickMachingButton}>매칭하기</button>
    </>
  );
};

export default LessonPage;

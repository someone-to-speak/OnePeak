"use client";
import { getUserClient } from "@/api/supabase/getUserClient";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

const page = () => {
  //유저정보 불러와서 차단당한 사람이면 alert useEffect로 띄운다.
  // useEffect 초기 렌더링 되자마자 실행되니까
  // csr컴포넌트면 클라이언트에서 가져와야함
  // 탠스택으로 유저정보 가져오고 alert만 userEffect
  // 탠스택 쓰려면 쿼리키 같아야함

  const { data, isPending, isError } = useQuery({
    queryKey: ["targetUserInfo"],
    queryFn: () => getUserClient()
  });

  useEffect(() => {
    if (data?.is_blocked) {
      alert("차단된 사용자입니다. 궁금한점이 있다면 1:1 문의를 남겨주세요");
    }
  });

  if (isPending) {
    return <div> 사용자의 차단 여부를 확인하고 있습니다..</div>;
  }
  if (isError) {
    return <div>사용자의 차단 여부를 확인하는데 실패하였습니다</div>;
  }

  return <div>1:1문의페이지</div>;
};

export default page;

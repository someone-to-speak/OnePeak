"use client";

import { UserInfo } from "@/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import UsersTable from "./UsersTable";
import PageNationUI from "../PageNationUI";
import { block, cancle, getUsersInfo, unblock, uncancle } from "@/app/api/api";

const searchNicknameShema = z.object({
  theNickname: z.string().min(1, {
    message: "nickname required"
  })
});

const UsersInfo = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      theNickname: ""
    },
    resolver: zodResolver(searchNicknameShema)
  });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [type, setType] = useState<string>("");
  const [theNickname, setTheNickname] = useState<string>("");

  // 유저들 정보 가져오기
  const {
    data: usersInfo = [],
    isPending,
    isError
  } = useQuery({
    queryKey: ["usersInfo", type, theNickname],
    queryFn: () => getUsersInfo(type, theNickname)
  });

  if (isPending) {
    return <div>로딩중..</div>;
  }

  if (isError) {
    return <div>회원 목록을 불러우는데 실패하였습니다</div>;
  }

  // 페이지네이션 계산
  const totalPages = usersInfo ? Math.ceil(usersInfo.length / usersPerPage) : 0;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usersInfo ? usersInfo.slice(indexOfFirstUser, indexOfLastUser) : [];

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 차단 해제
  const unblockUser = useMutation({
    mutationFn: (userInfo: UserInfo) => unblock(userInfo),
    onSuccess: () => {
      alert("해당 유저를 차단 해제 하였습니다");
      queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
    }
  });

  //차단
  const blockUser = useMutation({
    mutationFn: (userInfo: UserInfo) => block(userInfo),
    onSuccess: () => {
      alert("해당 유저를 차단 하였습니다");
      queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
    }
  });

  // 회원탈퇴
  const cancleUser = useMutation({
    mutationFn: (userInfo: UserInfo) => cancle(userInfo),
    onSuccess: () => {
      alert("해당 유저를 탈퇴처리하였습니다");
      queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
    }
  });

  // 회원 탈퇴 취소
  const uncancleUser = useMutation({
    mutationFn: (userInfo: UserInfo) => uncancle(userInfo),
    onSuccess: () => {
      alert("해당 유저를 가입상태로 변경하였습니다");
      queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
    }
  });

  const onSubmit = (value: FieldValues) => {
    searchNicknameShema.parse(value);
    setType("searchNickname");
    setTheNickname(value.theNickname);
    reset();
  };

  return (
    <div className="flex flex-col p-4">
      <div className="flex gap-16 px-auto py-3">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <input
            type="text"
            placeholder="search nickname"
            {...register("theNickname")}
            className="p-2 border border-gray-300 rounded w-64"
          />
          <button type="submit" className="ml-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            검색
          </button>
        </form>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setType("isBlocked")}
            className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-yellow-600"
          >
            차단회원
          </button>
          <button
            onClick={() => setType("isDeleted")}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            탈퇴회원
          </button>
          <button
            onClick={() => setType("isAll")}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            모든회원
          </button>
        </div>
      </div>
      <UsersTable
        currentUsers={currentUsers}
        indexOfFirstUser={indexOfFirstUser}
        unblockUser={unblockUser.mutate}
        blockUser={blockUser.mutate}
        cancleUser={cancleUser.mutate}
        uncancleUser={uncancleUser.mutate}
      />
      <PageNationUI
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        usersInfo={usersInfo}
      />
    </div>
  );
};

export default UsersInfo;

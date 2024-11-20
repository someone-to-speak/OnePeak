"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { block, withdraw, getUsersInfo, unblock, unWithdraw } from "@/api/supabase/admin";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Tables } from "../../../../../database.types";
import UsersTable from "@/components/admin/usersManagement/UsersTable";
import PageNationUI from "@/components/admin/PageNationUI";

type UserInfo = Tables<"user_info">;

const UsersInfo = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [type, setType] = useState<string>("");
  const [theNickname, setTheNickname] = useState<string>("");

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      targetNickname: ""
    }
  });

  // 유저들 정보 가져오기
  const {
    data: usersInfo = [],
    isPending,
    isError
  } = useQuery({
    queryKey: ["usersInfo", type, theNickname],
    queryFn: () => getUsersInfo(type, theNickname)
  });

  // 페이지네이션 계산
  const usersPerPage = 10;
  const totalPages = usersInfo ? Math.max(1, Math.ceil(usersInfo.length / usersPerPage)) : 1;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usersInfo ? usersInfo.slice(indexOfFirstUser, indexOfLastUser) : [];

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 차단 해제
  const unblockUser = useMutation({
    mutationFn: (userInfo: UserInfo) => unblock(userInfo.id),
    onSuccess: () => {
      alert("해당 유저를 차단 해제 하였습니다");
      queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
    }
  });

  //차단
  const blockUser = useMutation({
    mutationFn: (userInfo: UserInfo) => block(userInfo.id),
    onSuccess: () => {
      alert("해당 유저를 차단 하였습니다");
      queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
    }
  });

  // 회원탈퇴
  const withdrawUser = useMutation({
    mutationFn: (userInfo: UserInfo) => withdraw(userInfo),
    onSuccess: () => {
      alert("해당 유저를 탈퇴처리하였습니다");
      queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
    }
  });

  // 회원 탈퇴 취소
  const unWithdrawUser = useMutation({
    mutationFn: (userInfo: UserInfo) => unWithdraw(userInfo),
    onSuccess: () => {
      alert("해당 유저를 가입상태로 변경하였습니다");
      queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
    }
  });

  const onSubmit = (value: FieldValues) => {
    setType("searchNickname");
    setTheNickname(value.targetNickname);
    reset();
  };

  if (isPending) {
    return (
      <div className="m-auto">
        <LoadingSpinner />;
      </div>
    );
  }

  if (isError) {
    return <div>회원 목록을 불러오는데 실패하였습니다</div>;
  }

  return (
    <div className="flex flex-col p-4">
      <div className="flex gap-16 px-auto py-3">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <input
            type="text"
            placeholder="search nickname"
            {...register("targetNickname")}
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
        usersInfo={usersInfo}
        currentUsers={currentUsers}
        indexOfFirstUser={indexOfFirstUser}
        unblockUser={unblockUser.mutate}
        blockUser={blockUser.mutate}
        withdrawUwer={withdrawUser.mutate}
        unWithdrawUser={unWithdrawUser.mutate}
      />
      <PageNationUI
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        data={usersInfo}
      />
    </div>
  );
};

export default UsersInfo;

"use client";

import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import React, { useState } from "react";

import { BlockedUserInfo } from "@/type";
import { block, getBlockTargetUsers, unblock } from "@/api/supabase/admin";
import PageNationUI from "@/components/admin/PageNationUI";
import BlcokedUserTable from "@/components/admin/blockManagement/BlcokedUserTable";

const BlockManagementPage = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const { data = [] }: UseQueryResult<BlockedUserInfo[], Error> = useQuery({
    queryKey: ["blockTargetUsers"],
    queryFn: () => getBlockTargetUsers()
  });
  console.log("data", data);

  const blockUser = useMutation({
    mutationFn: (target: BlockedUserInfo) => block(target.target_id),
    onSuccess: () => {
      alert("해당 유저를 차단 하였습니다");
      queryClient.invalidateQueries({ queryKey: ["blockTargetUsers"] });
    }
  });

  const unblockUser = useMutation({
    mutationFn: (target: BlockedUserInfo) => unblock(target.target_id),
    onSuccess: () => {
      alert("해당 유저를 차단 해제 하였습니다");
      queryClient.invalidateQueries({ queryKey: ["blockTargetUsers"] });
    }
  });

  // 페이지네이션 계산
  const totalPages = data ? Math.ceil(data.length / usersPerPage) : 0;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = data ? data.slice(indexOfFirstUser, indexOfLastUser) : [];

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <BlcokedUserTable
        data={data}
        currentUsers={currentUsers}
        indexOfFirstUser={indexOfFirstUser}
        unblockUser={unblockUser.mutate}
        blockUser={blockUser.mutate}
      />
      <PageNationUI
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        usersInfo={data}
      />
    </div>
  );
};

export default BlockManagementPage;

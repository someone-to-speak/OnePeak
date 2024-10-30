"use client";

import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import React, { useState } from "react";
import PageNationUI from "../PageNationUI";
import { BlockedUserInfo } from "@/type";
import BlockDetail from "./BlockDetail";
import { block, getBlockTargetUsers, unblock } from "@/app/api/api";

const BlockTargetUsers = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const { data = [] }: UseQueryResult<BlockedUserInfo[], Error> = useQuery({
    queryKey: ["blockTargetUsers"],
    queryFn: () => getBlockTargetUsers()
  });

  const blockUser = useMutation({
    mutationFn: (target: BlockedUserInfo) => block(target),
    onSuccess: () => {
      alert("해당 유저를 차단 하였습니다");
      queryClient.invalidateQueries({ queryKey: ["blockTargetUsers"] });
    }
  });

  const unblockUser = useMutation({
    mutationFn: (target: BlockedUserInfo) => unblock(target),
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
      <div className="w-full text-center">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 font-semibold">
              <th className="p-3 "></th>
              <th className="p-3 ">id</th>
              <th className="p-3 ">닉네임</th>
              <th className="p-3 ">신고당한횟수</th>
              <th className="p-3">차단여부</th>
              <th className="p-3 ">차단관리</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="pt-3">
                  신고당한 회원이 없습니다
                </td>
              </tr>
            ) : (
              currentUsers.map((target, index) => (
                <tr key={target.id} className="border-b hover:bg-gray-50">
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td className="p-3 max-w-[150px] overflow-x-auto ">{target.id}</td>
                  <td className="p-3 max-w-[200px] overflow-x-auto">{target.user_info.nickname}</td>

                  <td className="p-3 ">{target.count}</td>

                  <td className="p-3 ">{target.user_info.is_blocked ? "차단회원" : "일반회원"}</td>
                  <td className="p-3 ">
                    {target.user_info.is_blocked ? (
                      <button
                        className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => {
                          const formatedTarget = { ...target, id: target.id };
                          unblockUser.mutate(formatedTarget);
                        }}
                      >
                        차단해제
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 text-white bg-orange-500 rounded hover:bg-red-600"
                        onClick={() => {
                          const formatedTarget = { ...target, id: target.id };
                          blockUser.mutate(formatedTarget);
                        }}
                      >
                        차단하기
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <PageNationUI
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        usersInfo={data}
      />
      <BlockDetail />
    </div>
  );
};

export default BlockTargetUsers;

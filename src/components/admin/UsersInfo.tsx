"use client";

import { block, cancle, getUsersInfo, unblock, uncancle } from "@/api/api";
import { UserInfo } from "@/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import UsersTable from "./UsersTable";

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
  const usersPerPage = 15;

  const [type, setType] = useState<string>("");
  const [theNickname, setTheNickname] = useState<string>("");

  // 유저들 정보 가져오기
  const { data: usersInfo } = useQuery({
    queryKey: ["usersInfo", type, theNickname],
    queryFn: () => getUsersInfo(type, theNickname)
  });

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

  // 차단 회원 정렬
  // const checkBlockedUser = useMutation({
  //   mutationFn: checkBlocked,

  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
  //   }
  // });

  // console.log(usersInfo);

  // // 삭제 회원 정렬
  // const cancledUsers = async () => {
  //   const { data, error } = await browserClient.from("user_info").select().eq("is_deleted", true);

  //   if (error) {
  //     console.log("Error", error.message);
  //     throw new Error("탈퇴한 회원들을 불러오는데 실패하였습니다");
  //   } else {
  //     setUsersInfo(data);
  //   }
  // };

  const onSubmit = (value: FieldValues) => {
    searchNicknameShema.parse(value);
    setType("searchNickname");
    setTheNickname(value.theNickname);
    reset();
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="search nickname" {...register("theNickname")} />
        <button>검색</button>
      </form>

      <div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setType("isBlocked");
            }}
          >
            차단회원
          </button>
          <button
            onClick={() => {
              setType("isDeleted");
            }}
          >
            탈퇴회원
          </button>
          <button
            onClick={() => {
              setType("isAll");
            }}
          >
            모든회원
          </button>
        </div>
        <UsersTable
          currentUsers={currentUsers}
          currentPage={currentPage}
          indexOfFirstUser={indexOfFirstUser}
          unblockUser={unblockUser.mutate}
          blockUser={blockUser.mutate}
          cancleUser={cancleUser.mutate}
          uncancleUser={uncancleUser.mutate}
        />
        {/* 페이지네이션 UI */}
        <div className=" flex items-center justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>

          <div className="px-3 py-1 rounded ">
            {currentPage} / {totalPages}
          </div>

          <button
            className="px-3 py-1  text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>

        <div className="text-center text-gray-600 mt-2">
          총 {usersInfo?.length}명, 총 {totalPages}페이지
        </div>
      </div>
    </div>
  );
};

export default UsersInfo;

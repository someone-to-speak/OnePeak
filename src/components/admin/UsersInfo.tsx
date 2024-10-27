"use client";

import { block, cancle, getUsersInfo, unblock, uncancle } from "@/api/api";
import { UserInfo } from "@/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

const UsersInfo = () => {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [theNickname, setTheNickname] = useState<string>("");
  const [type, setType] = useState<string>("");

  // 유저들 정보 가져오기
  const { data: usersInfo } = useQuery({
    queryKey: ["usersInfo", type, theNickname],
    queryFn: () => getUsersInfo(type, theNickname)
  });

  // 페이지네이션 계산
  const totalPages = usersInfo ? Math.ceil(usersInfo.length / usersPerPage) : 0;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usersInfo?.slice(indexOfFirstUser, indexOfLastUser);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 차단 해제
  const unblockUser = useMutation({
    mutationFn: (userInfo: UserInfo) => unblock(userInfo),
    onSuccess: () => {
      alert("해당 유저를 차단 해제 하시겠습니까?");
      queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
    }
  });

  //차단
  const blockUser = useMutation({
    mutationFn: (userInfo: UserInfo) => block(userInfo),
    onSuccess: () => {
      alert("해당 유저를 차단 하시겠습니까?");
      queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
    }
  });

  // 회원탈퇴
  const cancleUser = useMutation({
    mutationFn: (userInfo: UserInfo) => cancle(userInfo),
    onSuccess: () => {
      alert("해당 유저를 탍퇴시키겠습니까?");
      queryClient.invalidateQueries({ queryKey: ["usersInfo"] });
    }
  });

  // 회원 탈퇴 취소
  const uncancleUser = useMutation({
    mutationFn: (userInfo: UserInfo) => uncancle(userInfo),
    onSuccess: () => {
      alert("해당 유저를 재가입 시키겠습니까?");
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

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setType("searchNickname");
        }}
      >
        <input
          type="text"
          placeholder="search nickname"
          value={theNickname}
          onChange={(e) => setTheNickname(e.target.value)}
        />
        <button>검색</button>
      </form>
      <div className="flex gap-5">
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
      {usersInfo?.length === 0 ? (
        <p>등록된 회원이 없습니다</p>
      ) : (
        <div className="w-full text-center">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 font-semibold">
                <th className="p-3  ">닉네임</th>
                <th className="p-3 ">이메일</th>
                <th className="p-3">성별</th>
                <th className="p-3">언어</th>
                <th className="p-3 ">가입날짜</th>
                <th className="p-3">차단여부</th>
                <th className="p-3 ">차단관리</th>
                <th className="p-3">탈퇴여부</th>
                <th className="p-3">탈퇴관리</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers?.map((userInfo) => (
                <tr key={userInfo.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 max-w-[150px] overflow-x-auto ">{userInfo.nickname}</td>
                  <td className="p-3 max-w-[200px] overflow-x-auto">{userInfo.email}</td>
                  <td className="p-3 ">{userInfo.gender}</td>
                  <td className="p-3 ">{userInfo.language}</td>
                  <td className="p-3 ">{new Date(userInfo.created_at).toLocaleDateString()}</td>
                  <td className="p-3 ">{userInfo.is_blocked ? "차단회원" : "일반회원"}</td>
                  <td className="p-3 ">
                    {userInfo.is_blocked ? (
                      <button
                        className="px-3 py-1  text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => unblockUser.mutate(userInfo)}
                      >
                        차단해제
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => blockUser.mutate(userInfo)}
                      >
                        차단하기
                      </button>
                    )}
                  </td>
                  <td className="p-3 ">{userInfo.is_deleted ? "탈퇴회원" : "가입회원"}</td>
                  <td className="p-3 ">
                    {userInfo.is_deleted ? (
                      <button
                        className="px-3 py-1  text-white bg-green-500 rounded hover:bg-green-600"
                        onClick={() => uncancleUser.mutate(userInfo)}
                      >
                        가입하기
                      </button>
                    ) : (
                      <button
                        className="px-3 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
                        onClick={() => cancleUser.mutate(userInfo)}
                      >
                        탈퇴하기
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* 페이지네이션 UI */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          className="px-3 py-1 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>

        <div className="px-3 py-1 rounded ">{currentPage}</div>

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
  );
};

export default UsersInfo;

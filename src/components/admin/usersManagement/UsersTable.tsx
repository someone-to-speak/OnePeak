import React from "react";
import { Tables } from "../../../../database.types";
import { User } from "@supabase/supabase-js";

type UserInfo = Tables<"user_info">;

interface UsersTableProps {
  usersInfo: UserInfo[];
  currentUsers: UserInfo[];
  indexOfFirstUser: number;
  unblockUser: (userInfo: UserInfo) => void;
  blockUser: (userInfo: UserInfo) => void;
  withdrawUwer: (userInfo: UserInfo) => void;
  unWithdrawUser: (userInfo: UserInfo) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  usersInfo,
  currentUsers,
  indexOfFirstUser,
  unblockUser,
  blockUser,
  withdrawUwer,
  unWithdrawUser
}) => {
  return (
    <div className="w-full text-center">
      <table className="w-full border-separate border-spacing-0">
        <thead className="bg-gray-800 text-black">
          <tr>
            <th className="p-3"></th>
            <th className="p-3">닉네임</th>
            <th className="p-3">이메일</th>
            <th className="p-3">사용언어</th>
            <th className="p-3">배우는언어</th>
            <th className="p-3">가입날짜</th>
            <th className="p-3">차단여부</th>
            <th className="p-3">차단관리</th>
            <th className="p-3">탈퇴여부</th>
            <th className="p-3">탈퇴관리</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-3 text-gray-500">
                등록된 회원이 없습니다
              </td>
            </tr>
          ) : (
            currentUsers.map((userInfo, index) => (
              <tr key={userInfo.id} className="border-b hover:bg-gray-900">
                <td className="p-3">{indexOfFirstUser + index + 1}</td>
                <td className="p-3 max-w-[150px] text-ellipsis overflow-hidden">{userInfo.nickname}</td>
                <td className="p-3 max-w-[200px] text-ellipsis overflow-hidden">{userInfo.email}</td>
                <td className="p-3">{userInfo.my_language}</td>
                <td className="p-3">{userInfo.learn_language}</td>
                <td className="p-3">{new Date(userInfo.created_at).toLocaleDateString()}</td>
                <td className="p-3">{userInfo.is_blocked ? "차단회원" : "일반회원"}</td>
                <td className="p-3">
                  {userInfo.is_blocked ? (
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => unblockUser(userInfo)}
                    >
                      차단해제
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                      onClick={() => blockUser(userInfo)}
                    >
                      차단하기
                    </button>
                  )}
                </td>
                <td className="p-3">{userInfo.is_deleted ? "탈퇴회원" : "가입회원"}</td>
                <td className="p-3">
                  {userInfo.is_deleted ? (
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => unWithdrawUser(userInfo)}
                    >
                      가입하기
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => withdrawUwer(userInfo)}
                    >
                      탈퇴하기
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;

import React from "react";
import { Tables } from "../../../../database.types";

type UserInfo = Tables<"user_info">;

interface UsersTableProps {
  currentUsers: UserInfo[];

  indexOfFirstUser: number;
  unblockUser: (userInfo: UserInfo) => void;
  blockUser: (userInfo: UserInfo) => void;
  withdrawUwer: (userInfo: UserInfo) => void;
  unWithdrawUser: (userInfo: UserInfo) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  currentUsers,

  indexOfFirstUser,
  unblockUser,
  blockUser,
  withdrawUwer,
  unWithdrawUser
}) => {
  return (
    <div className="w-full text-center">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 font-semibold">
            <th className="p-3 "></th>
            <th className="p-3 ">닉네임</th>
            <th className="p-3 ">이메일</th>
            <th className="p-3">사용언어</th>
            <th className="p-3">베우는언어</th>
            <th className="p-3 ">가입날짜</th>
            <th className="p-3">차단여부</th>
            <th className="p-3 ">차단관리</th>
            <th className="p-3">탈퇴여부</th>
            <th className="p-3">탈퇴관리</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan={10} className="pt-3">
                등록된 회원이 없습니다
              </td>
            </tr>
          ) : (
            currentUsers.map((userInfo, index) => (
              <tr key={userInfo.id} className="border-b hover:bg-gray-900">
                <td>{indexOfFirstUser + index + 1}</td>
                <td className="p-3 max-w-[150px] overflow-x-auto ">{userInfo.nickname}</td>
                <td className="p-3 max-w-[200px] overflow-x-auto">{userInfo.email}</td>
                <td className="p-3 ">{userInfo.my_language}</td>
                <td className="p-3 ">{userInfo.learn_language}</td>
                <td className="p-3 ">{new Date(userInfo.created_at).toLocaleDateString()}</td>
                <td className="p-3 ">{userInfo.is_blocked ? "차단회원" : "일반회원"}</td>
                <td className="p-3 ">
                  {userInfo.is_blocked ? (
                    <button
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => unblockUser(userInfo)}
                    >
                      차단해제
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 text-white bg-orange-500 rounded hover:bg-red-600"
                      onClick={() => blockUser(userInfo)}
                    >
                      차단하기
                    </button>
                  )}
                </td>
                <td className="p-3 ">{userInfo.is_deleted ? "탈퇴회원" : "가입회원"}</td>
                <td className="p-3 ">
                  {userInfo.is_deleted ? (
                    <button
                      className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                      onClick={() => unWithdrawUser(userInfo)}
                    >
                      가입하기
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-gray-600"
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

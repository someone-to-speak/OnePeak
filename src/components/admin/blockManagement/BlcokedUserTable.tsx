import { BlockedUserInfo } from "@/type";
import Link from "next/link";
import React from "react";

interface BlcokedUserTableProps {
  data: BlockedUserInfo[];
  currentUsers: BlockedUserInfo[];
  indexOfFirstUser: number;
  unblockUser: (target: BlockedUserInfo) => void;
  blockUser: (target: BlockedUserInfo) => void;
}

const BlcokedUserTable: React.FC<BlcokedUserTableProps> = ({
  data,
  currentUsers,
  indexOfFirstUser,
  unblockUser,
  blockUser
}) => {
  console.log("data", data);
  return (
    <div className="w-full text-center">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 font-semibold">
            <th className="p-3 "></th>
            <th className="p-3 ">id</th>
            <th className="p-3 ">닉네임</th>
            <th className="p-3 ">신고누적횟수</th>
            <th className="p-3">신고내역</th>
            <th className="p-3">차단여부</th>
            <th className="p-3 ">차단관리</th>
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td colSpan={7} className="pt-3">
                신고당한 회원이 없습니다
              </td>
            </tr>
          ) : (
            currentUsers.map((target, index) => (
              <tr key={target.target_id} className="border-b hover:bg-gray-900">
                <td>{indexOfFirstUser + index + 1}</td>
                <td className="p-3 max-w-[150px] overflow-x-auto">{target.target_id}</td>
                <td className="p-3 max-w-[200px] overflow-x-auto">{target.user_info.nickname}</td>
                <td className="p-3">{target.count}</td>
                <td>
                  <Link href={`blockManagement/${target.target_id}`}>
                    <button className="px-3 py-1 text-white bg-green-500 rounded hover:bg-blue-600">내역 확인</button>
                  </Link>
                </td>
                <td className="p-3 ">{target.user_info.is_blocked ? "차단회원" : "일반회원"}</td>
                <td className="p-3 ">
                  {target.user_info.is_blocked ? (
                    <button
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => {
                        const formatedTarget = { ...target, id: target.target_id };
                        unblockUser(formatedTarget);
                      }}
                    >
                      차단해제
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 text-white bg-orange-500 rounded hover:bg-red-600"
                      onClick={() => {
                        const formatedTarget = { ...target, id: target.target_id };
                        blockUser(formatedTarget);
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
  );
};

export default BlcokedUserTable;

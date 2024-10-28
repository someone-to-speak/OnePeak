"use client";
import { createClient } from "@/utils/supabase/client";

// import { error } from "console";
import { UUID } from "crypto";

import React, { useEffect, useState } from "react";

type userInfo = {
  id: UUID;
  profile_url: string;
  nickname: string;
  gender: string;
  language: string;
  state_msg: string;
  is_deleted: boolean;
  is_blocked: boolean;
  created_at: Date;
};

const UsersInfo = () => {
  //이게 서버컴포넌트인지 클라이언트컴포넌트인지 명시적으로 알게하기 위해서 매번 이렇게 씀. 그래서 creatClient도 서버or클라이언트 import 주의
  const browserClient = createClient();
  const [usersInfo, setUsersInfo] = useState<userInfo[]>([]);
  const [theNickname, setTheNickname] = useState<string>("");

  useEffect(() => {
    const fetchUsersInfo = async () => {
      const { data, error } = await browserClient.from("user_info").select();

      if (error) {
        console.log("Error", error.message);
        throw new Error("사용자들 정보를 가져오는데 실패하였습니다");
      } else {
        console.log(data);
        setUsersInfo(data);
      }
    };
    fetchUsersInfo();
  }, []);

  // 차단 해제
  const unblockUser = async (targetUser: userInfo) => {
    alert("정말 차단을 해제 하시겠습니까?");
    const { error } = await browserClient.from("user_info").update({ is_blocked: false }).eq("id", targetUser.id);

    if (error) {
      console.log("Error", error.message);
      throw new Error("사용자를 차단해제 하는데 실패하였습니다");
    } else {
      setUsersInfo((prev) => {
        return prev.map((prevUserInfo) => {
          if (prevUserInfo.id === targetUser.id) {
            return { ...targetUser, is_blocked: false };
          } else {
            return prevUserInfo;
          }
        });
      });
    }
  };

  //차단
  const blockUser = async (targetUser: userInfo) => {
    alert("정말 차단하시겠습니까?");
    const { error } = await browserClient.from("user_info").update({ is_blocked: true }).eq("id", targetUser.id);

    if (error) {
      console.log("Error", error.message);
      throw new Error("사용자를 차단하는데 실패하였습니다");
    } else {
      setUsersInfo((prev) => {
        return prev.map((prevUserInfo) => {
          if (prevUserInfo.id === targetUser.id) {
            return { ...targetUser, is_blocked: true };
          } else {
            return prevUserInfo;
          }
        });
      });
    }
  };

  // 회원탈퇴
  const cancleAccount = async (targetUser: userInfo) => {
    alert("정말 회원 계정을 탈퇴시키겠습니까?");
    const { error } = await browserClient.from("user_info").update({ is_deleted: true }).eq("id", targetUser.id);

    if (error) {
      console.log("Error", error.message);
      throw new Error("사용자 계정을 탈퇴시키는데 실패하였습니다");
    } else {
      setUsersInfo((prev) => {
        return prev.map((prevUserInfo) => {
          if (prevUserInfo.id === targetUser.id) {
            return { ...targetUser, is_deleted: true };
          } else {
            return prevUserInfo;
          }
        });
      });
    }
  };

  // 회원 탈퇴 취소
  const uncancleAccount = async (targetUser: userInfo) => {
    alert("정말 해당 회원 계정을 복구시키겠습니까?");
    const { error } = await browserClient.from("user_info").update({ is_deleted: false }).eq("id", targetUser.id);

    if (error) {
      console.log("Error", error.message);
      throw new Error("사용자 계정을 복구하는데 실패하였습니다");
    } else {
      setUsersInfo((prev) => {
        return prev.map((prevUserInfo) => {
          if (prevUserInfo.id === targetUser.id) {
            return { ...targetUser, is_deleted: false };
          } else {
            return prevUserInfo;
          }
        });
      });
    }
  };

  // 차단 회원 정렬
  const blockedUsers = async () => {
    const { data, error } = await browserClient.from("user_info").select().eq("is_blocked", true);

    if (error) {
      console.log("Error", error.message);
      throw new Error("차단한 회원들을 불러오는데 실패하였습니다");
    } else {
      setUsersInfo(data);
    }
  };

  // 삭제 회원 정렬
  const cancledUsers = async () => {
    const { data, error } = await browserClient.from("user_info").select().eq("is_deleted", true);

    if (error) {
      console.log("Error", error.message);
      throw new Error("탈퇴한 회원들을 불러오는데 실패하였습니다");
    } else {
      setUsersInfo(data);
    }
  };

  // 닉네임으로 회원 검색
  const searchNickname = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await browserClient.from("user_info").select().eq("nickname", theNickname);
    console.log("data", data);
    if (error) {
      console.log("Error", error.message);
      throw new Error(`${theNickname} 회원을 찾는데 실패하였습니다`);
    } else {
      setUsersInfo(data);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => searchNickname(e)}>
        <input
          type="text"
          placeholder="search nickname"
          value={theNickname}
          onChange={(e) => setTheNickname(e.target.value)}
        />
        <button>검색</button>
      </form>
      <div className="flex gap-5">
        <button onClick={blockedUsers}>차단회원</button>
        <button onClick={cancledUsers}>탈퇴회원</button>
        <button>모든회원</button>
      </div>
      {usersInfo.length === 0 ? (
        <p>등록된 회원이 없습니다</p>
      ) : (
        usersInfo.map((userInfo) => {
          return (
            <div key={userInfo.id} className="flex gap-5">
              <p>{userInfo.nickname}</p>
              <p>{userInfo.gender}</p>
              <p>{userInfo.language}</p>
              {userInfo.is_blocked ? (
                <button onClick={() => unblockUser(userInfo)}>차단해제</button>
              ) : (
                <button onClick={() => blockUser(userInfo)}>차단</button>
              )}
              {userInfo.is_deleted ? (
                <button onClick={() => uncancleAccount(userInfo)}>탈퇴</button>
              ) : (
                <button onClick={() => cancleAccount(userInfo)}>회원</button>
              )}
              <p>{userInfo.created_at.toString()}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UsersInfo;

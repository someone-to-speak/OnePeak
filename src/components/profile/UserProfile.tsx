"use client";

import { useState } from "react";
// import { useEffect } from "react";
// import { createClient } from "@/utils/supabase/client";
import ProfileImageDelete from "./ProfileImageDelete";
// import Image from "next/image";

interface UserProfile {
  nickname: string;
  profile_url: string;
  language: string;
  state_msg: string;
}

const UserProfile = () => {
  // const supabase = createClient();
  // const [userId, setUserId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>("dummyUserId"); // 더미 userId
  // const [loading, setLoading] = useState(true);
  // const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProfile, setUserProfile] = useState({
    email: "test@example.com",
    nickname: "나는 테스트 유저",
    state_msg: "상태메세지는 졸려",
    gender: "w",
    language: "🇰🇷",
    profile_url: "https://example.com/example.jpg",
    grammerChal_level: "3",
    study_lang: "english"
  });

  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     setLoading(true);
  //     const {
  //       data: { user },
  //       error: userError
  //     } = await supabase.auth.getUser();

  //     if (userError) {
  //       console.error("유저 오류", userError);
  //       setError("유저 정보를 가져오는 데 실패했습니다.");
  //       setLoading(false);
  //       return;
  //     }

  //     if (user) {
  //       setUserId(user.id);
  //       const { data, error: profileError } = await supabase
  //         .from("profiles")
  //         .select("*")
  //         .eq("user_id", user.id)
  //         .single();

  //       if (profileError) {
  //         console.error("프로필 오류", profileError);
  //         setError("프로필 정보를 가져오는 데 실패했습니다.");
  //       } else {
  //         setUserProfile(data);
  //       }
  //     } else {
  //       console.log("사용자가 로그인하지 않았습니다.");
  //     }

  //     setLoading(false);
  //   };

  //   fetchUserProfile();
  // }, [supabase]);

  // if (loading) {
  //   return <p>로딩 중...</p>;
  // }

  // if (error) {
  //   return <p>{error}</p>;
  // }

  return (
    <div>
      <h1>사용자 프로필</h1>
      {userId && <ProfileImageDelete userId={userId} />}
      {userProfile ? (
        <div>
          {/* <Image src={userProfile.profile_url} alt="Profile Image" width={150} height={150} layout="responsive" /> */}
          <p>{userProfile.language}</p>
          <h1>{userProfile.nickname}</h1>
          <li>{userProfile.state_msg}</li>
        </div>
      ) : (
        <p>사용자 정보를 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default UserProfile;

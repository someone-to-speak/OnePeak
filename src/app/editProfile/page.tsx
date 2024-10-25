"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { UserProfile } from "@/types/UserProfile";
import ProfileImageDelete from "@/components/profile/ProfileImageDelete";

const EditProfile = () => {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  // const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProfile, setUserProfile] = useState({
    nickname: "나는 테스트 유저",
    state_msg: "상태메세지는 졸려",
    profile_url: "https://placehold.co/200x200/EEE/31343C"
  });
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     const {
  //       data: { user },
  //       error: userError
  //     } = await supabase.auth.getUser();

  //     if (userError) {
  //       console.error("유저 오류", userError);
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
  //       } else {
  //         setUserProfile(data);
  //       }
  //     }
  //     setLoading(false);
  //   };

  //   fetchUserProfile();
  // }, [supabase]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setUserProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (userProfile) {
  //     const { error } = await supabase
  //       .from("profiles")
  //       .update({
  //         nickname: userProfile.nickname,
  //         profile_url: userProfile.profile_url,
  //         state_msg: userProfile.state_msg
  //       })
  //       .eq("user_id", userProfile.user_id);

  //     if (error) {
  //       alert("프로필 업데이트에 실패했습니다.");
  //     } else {
  //       alert("프로필이 성공적으로 업데이트되었습니다.");
  //       router.push("/userProfile");
  //     }
  //   }
  // };

  // if (loading) {
  //   return <p>로딩 중...</p>;
  // }

  return (
    <div>
      <h1>프로필 수정하기</h1>
      {/* <form onSubmit={handleSubmit}> */}
      {/* TODO: input에 onChange={handleChange} 추가 */}
      <div>
        <label>
          프로필 이미지:
          <input type="text" name="profile_url" value={userProfile?.profile_url || ""} />
        </label>
        <ProfileImageDelete userId={userId} />
      </div>
      <div>
        <label>
          닉네임:
          <input type="text" name="nickname" value={userProfile?.nickname || ""} />
        </label>
      </div>

      <div>
        <label>
          상태 메시지:
          <input type="text" name="state_msg" value={userProfile?.state_msg || ""} />
        </label>
      </div>
      {/* <button type="submit">수정 완료</button> */}
      {/* </form> */}
    </div>
  );
};

export default EditProfile;

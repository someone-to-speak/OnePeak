"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserProfileType } from "@/types/UserProfile";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import { createClient } from "@/utils/supabase/client";

const EditProfile = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("유저 오류", userError);
        return;
      }

      if (user) {
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error("프로필 오류", profileError);
        } else {
          setUserProfile(data);
        }
      }
    };

    fetchUserProfile();
  }, [supabase]);

  const handleUploadSuccess = (url: string) => {
    setUserProfile((prev) => (prev ? { ...prev, profile_url: url } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userProfile) {
      const { error } = await supabase
        .from("profiles")
        .update({
          nickname: userProfile.nickname,
          profile_url: userProfile.profile_url,
          state_msg: userProfile.state_msg
        })
        .eq("user_id", userProfile.user_id);

      if (error) {
        alert("프로필 업데이트에 실패했습니다.");
      } else {
        alert("프로필이 성공적으로 업데이트되었습니다.");
        router.push("/myPage");
      }
    }
  };

  return (
    <div>
      <h1>프로필 수정하기</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            프로필 이미지:
            <ProfileImageUpload onUploadSuccess={handleUploadSuccess} />
          </label>
        </div>
        <div>
          <label>
            닉네임:
            <input
              type="text"
              name="nickname"
              value={userProfile?.nickname || ""}
              onChange={(e) => setUserProfile((prev) => (prev ? { ...prev, nickname: e.target.value } : null))}
            />
          </label>
        </div>
        <div>
          <label>
            상태 메시지:
            <input
              type="text"
              name="state_msg"
              value={userProfile?.state_msg || ""}
              onChange={(e) => setUserProfile((prev) => (prev ? { ...prev, state_msg: e.target.value } : null))}
            />
          </label>
        </div>
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
};

export default EditProfile;

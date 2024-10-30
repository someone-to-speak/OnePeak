"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserPen } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { UserProfile } from "@/types/user/UserProfile";

const UserProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("유저 오류", sessionError);
        setError("유저 정보를 가져오는 데 실패했습니다.");
        setLoading(false);
        return;
      }

      if (session) {
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (profileError) {
          console.error("프로필 오류", profileError);
          setError("프로필 정보를 가져오는 데 실패했습니다.");
        } else {
          setProfile(data);
        }
      } else {
        console.log("사용자가 로그인하지 않았습니다.");
      }

      setLoading(false);
    };

    fetchUserProfile();
  }, [supabase]);

  if (loading) {
    return <p className="text-center text-lg font-semibold">로딩 중...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const handleEditProfile = () => {
    router.push("/editProfile");
  };
  console.log(profile?.profile_url);

  return (
    <div className="flex flex-col items-center mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-700">사용자 프로필</h1>
      {profile ? (
        <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg shadow-md max-w-sm w-full bg-white">
          <div className="flex flex-row items-center gap-4">
            <div className="w-[80px] h-[80px] overflow-hidden rounded-full shadow-md mb-4">
              <Image
                src={profile.profile_url}
                alt="Profile Image"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <div className="flex flex-row items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {profile.language} {profile.nickname}
                </h2>
                <UserPen
                  size={34}
                  strokeWidth={1.8}
                  onClick={handleEditProfile}
                  className="p-2 text-white bg-gray-500 hover:bg-gray-600 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{profile.state_msg}</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col w-[120px] h-[80px] bg-gray-100 p-2 rounded-xl">
              <p className="text-gray-600 text-sm">배우고싶은 언어</p>
              <p className="text-2xl">{profile.study_lang}</p>
            </div>
            <div className="flex flex-col w-[120px] h-[80px] bg-gray-100 p-2 rounded-xl">
              <p className="text-gray-600 text-sm">챌린지 단어</p>
              <p className="text-gray-600 text-2xl">1</p>
            </div>
            <div className="flex flex-col w-[120px] h-[80px] bg-gray-100 p-2 rounded-xl">
              <p className="text-gray-600 text-sm">챌린지 문법</p>
              <p className="text-gray-600 text-2xl">1</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">사용자 정보를 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default UserProfilePage;

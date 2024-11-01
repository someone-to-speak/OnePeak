"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserPen } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../database.types";

type UserProfileProps = {
  userId: string; // userId의 UUID 타입
};
type UserProfileType = Tables<"user_info">;

const UserProfilePage = ({ userId }: UserProfileProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);

      const { data, error } = await supabase.from("user_info").select("*").eq("id", userId).single();

      if (error) {
        console.error("프로필 오류", error);
        setError("프로필 정보를 가져오는 데 실패했습니다.");
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchUserProfile();
  }, [supabase, userId]);

  if (loading) {
    return <p className="text-center text-lg font-semibold">로딩 중...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const handleEditProfile = () => {
    router.push("/myPage/editProfile");
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
                  {profile.my_language} {profile.nickname}
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
              <p className="text-2xl">{profile.learn_language}</p>
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

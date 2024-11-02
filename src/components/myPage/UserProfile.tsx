"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserRoundPenIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../database.types";

type UserProfileProps = {
  userId: string;
};

type UserProfileType = Pick<Tables<"user_info">, "id" | "nickname" | "profile_url" | "state_msg">;

const UserProfilePage = ({ userId }: UserProfileProps) => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [myLanguageUrl, setMyLanguageUrl] = useState<string>("");
  const [learnLanguageUrl, setLearnLanguageUrl] = useState<string>("");
  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error: langError } = await supabase
        .from("user_info")
        .select(
          "id, nickname, profile_url, state_msg, my_language:language!user_info_my_language_fkey(language_img_url), learn_language:language!user_info_learn_language_fkey(language_img_url)"
        )
        .eq("id", userId)
        .single();

      if (langError) {
        setError(langError.message);
        return;
      }

      if (data) {
        setProfile(data);
        if (data.my_language) {
          setMyLanguageUrl(data.my_language.language_img_url);
        }
        if (data.learn_language) {
          setLearnLanguageUrl(data.learn_language.language_img_url);
        }
      }
    };
    fetchUserProfile();
  }, [userId]);

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const handleEditProfile = () => {
    router.push(`/myPage/editProfile?userId=${userId}`);
  };

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
                <div className="w-[20px] h-[20px] overflow-hidden rounded-full shadow-md">
                  <Image
                    src={myLanguageUrl}
                    alt="Profile Image"
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{profile.nickname}</h2>
                <UserRoundPenIcon
                  size={22}
                  strokeWidth={1.8}
                  onClick={handleEditProfile}
                  className="p-[4px] text-gray-500 focus:outline-none"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{profile.state_msg}</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col w-[120px] h-[80px] bg-gray-100 p-2 rounded-xl">
              <p className="text-gray-600 text-sm">배우고 싶은 언어</p>
              <div className="w-[20px] h-[20px] overflow-hidden rounded-full shadow-md mb-4">
                <Image
                  src={learnLanguageUrl}
                  alt="Profile Image"
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
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

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../database.types";
import { PageProps } from "../../../.next/types/app/layout";

type UserProfileProps = {
  userId: string;
};

type UserProfileType = Pick<Tables<"user_info">, "id" | "nickname" | "profile_url" | "state_msg">;

const UserProfilePage = ({ userId }: UserProfileProps) => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [myLanguageUrl, setMyLanguageUrl] = useState<string>("");
  const [learnLanguageUrl, setLearnLanguageUrl] = useState<string>("");
  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data } = await supabase
        .from("user_info")
        .select(
          "id, nickname, profile_url, state_msg, my_language:language!user_info_my_language_fkey(language_img_url), learn_language:language!user_info_learn_language_fkey(language_img_url)"
        )
        .eq("id", userId)
        .single();

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
  }, [userId, supabase]);

  const handleEditProfile = () => {
    router.push(`/myPage/editProfile?userId=${userId}`);
  };

  return (
    <div className="flex flex-col items-center mt-10 space-y-6">
      {profile ? (
        <div className="flex flex-col items-start p-6 w-full">
          <div className="flex flex-row items-center gap-4">
            <div className="overflow-hidden rounded-xl shadow-md">
              <div className="w-[80px] h-[80px] overflow-hidden shadow-md relative">
                <Image
                  src={profile.profile_url}
                  alt="Profile Image"
                  fill
                  className="object-cover w-full h-full"
                  priority
                  sizes="(max-width: 768px) 100px, (max-width: 1200px) 200px, 200px"
                />
              </div>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="flex flex-row items-center gap-2">
                <div className="w-[14px] h-[14px] overflow-hidden rounded-full shadow-md relative">
                  <Image
                    src={myLanguageUrl}
                    alt="Languageurl"
                    fill
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100px, (max-width: 1200px) 200px, 200px"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{profile.nickname}</h2>
                <button onClick={handleEditProfile} className="text-blue-600 hover:underline">
                  프로필 수정하기
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">{profile.state_msg}</p>
              <div className="flex flex-row items-center gap-2">
                <p className="text-gray-600 text-sm">Learn</p>
                <div className="w-[14px] h-[14px] overflow-hidden shadow-md rounded-full relative">
                  <Image
                    src={learnLanguageUrl}
                    alt="Languageurl"
                    fill
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100px, (max-width: 1200px) 200px, 200px"
                  />
                </div>
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

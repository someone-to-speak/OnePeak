"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../database.types";

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
    <>
      {profile ? (
        <div className="py-[20px]">
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row justify-start gap-2">
              <div className="overflow-hidden rounded-2xl shadow-md">
                <div className="w-[80px] h-[80px] overflow-hidden relative">
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
              <div className="flex flex-col justify-start gap-1 p-2">
                <div className="flex flex-row items-center gap-2">
                  <div className="w-4 h-4 rounded-[5px] border border-[#d9d9d9] relative">
                    <Image
                      src={myLanguageUrl}
                      alt="Languageurl"
                      fill
                      className="object-cover w-full h-full"
                      sizes="(max-width: 768px) 100px, (max-width: 1200px) 200px, 200px"
                    />
                  </div>
                  <h2 className="text-[#0c0c0c] text-base font-bold font-['SUIT'] leading-normal">
                    {profile.nickname}
                  </h2>
                </div>
                <p className="text-[#3f3f3f] text-sm font-medium font-['Pretendard'] leading-[21px]">
                  {profile.state_msg}
                </p>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-[#8c8c8c] text-xs font-medium font-['Pretendard'] leading-[18px]">학습언어</p>
                  <div className="w-4 h-4 rounded-[5px] border border-[#d9d9d9] relative">
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
            <button
              onClick={handleEditProfile}
              className="text-[#8c8c8c] text-sm font-medium font-['Pretendard'] leading-[21px]"
            >
              프로필 수정하기
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">사용자 정보를 찾을 수 없습니다.</p>
      )}
    </>
  );
};

export default UserProfilePage;

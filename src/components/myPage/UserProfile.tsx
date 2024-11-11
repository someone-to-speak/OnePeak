"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../database.types";
import UserProfile from "../ui/userProfile";

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

  useEffect(() => {
    if (userId) {
      router.prefetch(`/myPage/editProfile?userId=${userId}`);
    }
  }, [userId, router]);

  return (
    <UserProfile
      name={profile?.nickname || ""}
      country={myLanguageUrl}
      profileImage={profile?.profile_url || ""}
      lastMessage={profile?.state_msg || ""}
      learnLanguageUrl={learnLanguageUrl}
      learnLanguage={learnLanguageUrl}
      onClick={() => router.push(`/myPage/editProfile?userId=${userId}`)}
    />
  );
};

export default UserProfilePage;

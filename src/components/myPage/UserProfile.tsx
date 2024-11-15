"use client";

import { useRouter } from "next/navigation";
import UserProfile from "../ui/userProfile";
import { useUserProfile } from "@/hooks/useUserProfile";
import LoadingSpinner from "../ui/LoadingSpinner";

type UserProfileProps = {
  userId: string;
};

const UserProfilePage = ({ userId }: UserProfileProps) => {
  const router = useRouter();
  const { data: profile, isLoading } = useUserProfile(userId);

  if (isLoading)
    return (
      <div className="m-auto">
        <LoadingSpinner />
      </div>
    );
  if (!profile) return;

  return (
    <UserProfile
      name={profile.nickname || ""}
      profileImage={profile.profile_url || ""}
      lastMessage={profile.state_msg || ""}
      learnLanguage={profile.learn_language?.language_name || ""}
      myLanguage={profile.my_language?.language_name || ""}
      learnLanguageUrl={profile.learn_language?.language_img_url || ""}
      myLanguageUrl={profile.my_language?.language_img_url || ""}
      onClick={() => router.push(`/myPage/editProfile`)}
    />
  );
};

export default UserProfilePage;

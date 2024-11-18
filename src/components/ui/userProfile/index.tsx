import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Typography } from "../typography";

interface UserProfileProps {
  name: string;
  profileImage: string;
  lastMessage: string;
  learnLanguageUrl: string;
  learnLanguage: string;
  myLanguage: string;
  myLanguageUrl: string;
  onClick: () => void;
}

const UserProfile = ({
  name,
  profileImage,
  lastMessage,
  learnLanguageUrl,
  learnLanguage,
  myLanguage,
  myLanguageUrl,
  onClick
}: UserProfileProps) => {
  return (
    <div onClick={onClick} className={cn("flex gap-[10px] py-[20px] rounded-[10px] border-none w-full items-center")}>
      {/* image part */}
      <UserProfileImage profileImage={profileImage} />
      {/* content part */}
      <UserProfileContent
        name={name}
        lastMessage={lastMessage}
        learnLanguageUrl={learnLanguageUrl}
        learnLanguage={learnLanguage}
        myLanguage={myLanguage}
        myLanguageUrl={myLanguageUrl}
        onClick={onClick}
      />
    </div>
  );
};

export default UserProfile;

const UserProfileImage = ({ profileImage }: { profileImage: string }) => {
  return profileImage ? (
    <Image src={profileImage || "/app-icon.png"} alt="profile" width={78} height={78} className="rounded-[20px]" />
  ) : null;
};

const UserProfileContent = ({
  name,
  lastMessage,
  learnLanguageUrl,
  learnLanguage,
  myLanguageUrl,
  onClick
}: Omit<UserProfileProps, "profileImage">) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <FlagIcon countryImageUrl={myLanguageUrl} size={12} />
          <Typography size={16} className="font-bold text-gray-50 truncate w-[140px]">
            {name}
          </Typography>
        </div>
        <button onClick={onClick} className="text-gray-500 text-nowrap">
          <Typography size={14} weight="medium">
            프로필 수정
          </Typography>
        </button>
      </div>
      <Typography size={14} weight="medium" className="text-gray-200 truncate">
        {lastMessage}
      </Typography>
      <div className="flex items-center gap-1 pb-1">
        <Typography size={12} weight="medium" className="text-gray-600">
          학습 언어
        </Typography>
        <div className="flex items-center gap-0.5">
          <FlagIcon countryImageUrl={learnLanguageUrl} size={12} />
          <Typography size={12} className="font-bold">
            {learnLanguage === "Korean" ? "한국어" : "영어"}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export const FlagIcon = ({ countryImageUrl, size = 14 }: { countryImageUrl: string; size?: number }) => {
  return countryImageUrl ? (
    <Image src={countryImageUrl} className="rounded-[5px]" alt={`${countryImageUrl} flag`} width={size} height={size} />
  ) : null;
};

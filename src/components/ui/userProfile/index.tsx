import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Typography } from "../typography";

interface UserProfileProps {
  name: string;
  country: string;
  profileImage: string;
  lastMessage: string;
  learnLanguageUrl: string;
  learnLanguage: string;
  onClick: () => void;
}

const UserProfile = ({
  name,
  country,
  profileImage,
  lastMessage,
  learnLanguageUrl,
  learnLanguage,
  onClick
}: UserProfileProps) => {
  return (
    <div
      onClick={onClick}
      className={cn("flex gap-[10px] py-[20px] rounded-[10px] border-none bg-white w-full items-center cursor-pointer")}
    >
      {/* image part */}
      <UserProfileImage profileImage={profileImage} />
      {/* content part */}
      <UserProfileContent
        name={name}
        country={country}
        lastMessage={lastMessage}
        learnLanguageUrl={learnLanguageUrl}
        learnLanguage={learnLanguage}
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
  country,
  lastMessage,
  learnLanguageUrl
}: Omit<UserProfileProps, "profileImage" | "onClick">) => {
  return (
    <div className="flex flex-col gap-0.5 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <FlagIcon countryImageUrl={country} />
          <Typography size={14} className="font-bold text-gray-50 truncate w-[140px]">
            {name}
          </Typography>
        </div>
        <Typography size={12} className="text-gray-600 font-medium font-pretendard text-nowrap text-right">
          프로필 수정
        </Typography>
      </div>
      <Typography size={12} className="text-gray-200 font-medium font-pretendard truncate">
        {lastMessage}
      </Typography>
      <div className="flex items-center gap-1  pb-1">
        <Typography size={10} className="text-gray-600 font-medium font-pretendard">
          학습 언어
        </Typography>
        <div className="flex items-center gap-0.5">
          <FlagIcon countryImageUrl={learnLanguageUrl} size={12} />
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

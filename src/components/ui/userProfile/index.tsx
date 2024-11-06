import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import Icon from "../icon";
import { Typography } from "../typography";

interface UserProfileProps {
  name: string;
  country: string;
  profileImage: string;
  lastMessage: string;
  learnLanguage: "ko" | "en";
}

const UserProfile = ({ name, country, profileImage, lastMessage, learnLanguage }: UserProfileProps) => {
  return (
    <div
      className={cn(
        "flex gap-[10px] p-3 rounded-[10px] border border-primary-800 bg-white shadow-review max-w-[343px] items-center"
      )}
    >
      {/* image part */}
      <UserProfileImage profileImage={profileImage} />
      {/* content part */}
      <UserProfileContent name={name} country={country} lastMessage={lastMessage} learnLanguage={learnLanguage} />
    </div>
  );
};

export default UserProfile;

const UserProfileImage = ({ profileImage }: { profileImage: string }) => {
  return <Image src={profileImage} alt="profile" width={62} height={62} className="rounded-[20px]" />;
};

const UserProfileContent = ({ name, country, lastMessage, learnLanguage }: Omit<UserProfileProps, "profileImage">) => {
  return (
    <div className="flex flex-col gap-0.5 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <FlagIcon country={country} />
          <Typography size={14} className="font-bold text-gray-50">
            {name}
          </Typography>
        </div>
        <Icon name="camera" />
      </div>
      <Typography size={12} className="text-gray-200 font-medium font-pretendard">
        {lastMessage}
      </Typography>
      <div className="flex items-center gap-1  pb-1">
        <Typography size={10} className="text-gray-600 font-medium font-pretendard">
          학습 언어
        </Typography>
        <div className="flex items-center gap-0.5">
          <FlagIcon country={learnLanguage} size={12} />
          <Typography size={10} className="text-black font-bold">
            {learnLanguage === "ko" ? "한국어" : "영어"}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export const FlagIcon = ({ country, size = 14 }: { country: "ko" | "en" | string; size?: number }) => {
  return (
    <Image src={`/flags/${country}.png`} className="rounded-[5px]" alt={`${country} flag`} width={size} height={size} />
  );
};

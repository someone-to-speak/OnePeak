import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Typography } from "../typography";
import Icon from "../icon";

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
      className={cn(
        "flex gap-[10px] px-3 py-[20px] rounded-[10px] bg-white w-full items-center cursor-pointer shadow-review "
      )}
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
        onClick={onClick}
      />
    </div>
  );
};

export default UserProfile;

const UserProfileImage = ({ profileImage }: { profileImage: string }) => {
  return profileImage ? (
    <Image
      src={profileImage || "/app-icon.png"}
      alt="profile"
      width={62}
      height={62}
      className="rounded-[20px] w-[62px] h-[62px] md:w-[66px] md:h-[66px]"
    />
  ) : null;
};

const UserProfileContent = ({
  name,
  country,
  lastMessage,
  learnLanguageUrl,
  learnLanguage,

  onClick
}: Omit<UserProfileProps, "profileImage">) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <FlagIcon countryImageUrl={country} />
          <Typography size={14} className="font-bold text-gray-50 truncate w-[140px] md:text-[18px]">
            {name}
          </Typography>
        </div>
        <button onClick={onClick} className="flex justify-center items-center">
          <Icon name="dotThree" size={25} color="#0D0D0D" />
        </button>
      </div>
      <Typography size={12} className="text-gray-200 font-medium font-pretendard truncate md:text-[16px]">
        {lastMessage}
      </Typography>
      <div className="flex items-center gap-1  pb-1">
        <Typography size={10} className="text-gray-600 font-medium font-pretendard md:text-[14px]">
          학습 언어
        </Typography>
        <div className="flex items-center gap-0.5">
          <FlagIcon countryImageUrl={learnLanguageUrl} size={12} />
          <Typography size={10} className="font-bold md:text-[14px]">
            {learnLanguage === "korean" ? "한국어" : "영어"}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export const FlagIcon = ({ countryImageUrl, size = 14 }: { countryImageUrl: string; size?: number }) => {
  return countryImageUrl ? (
    <Image
      src={countryImageUrl}
      alt={`${countryImageUrl} flag`}
      width={size}
      height={size}
      className="rounded-[5px] md:w-[18px] md:h-[18px]"
    />
  ) : null;
};

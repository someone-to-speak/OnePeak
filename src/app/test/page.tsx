"use client";

import Button from "@/components/ui/button/index";
import Icon from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";

import React from "react";

// interface UserProfileProps {
//   name: string;
//   country: string;
//   profileImage: string;
//   lastMessage: string;
//   learnLanguage: "ko" | "en";
// }

// const USER_PROFILES_DATA: UserProfileProps[] = [
//   {
//     name: "John Doe",
//     country: "en",
//     profileImage: "https://i.pravatar.cc/300",
//     lastMessage: "Hello, how are you?",
//     learnLanguage: "ko"
//   },
//   {
//     name: "Jane Doe",
//     country: "ko",
//     profileImage: "https://i.pravatar.cc/300",
//     lastMessage: "안녕하세요, 어떻게 지내세요?",
//     learnLanguage: "en"
//   }
// ];

const PlayGround = () => {
  return (
    <div className="p-8 flex flex-col gap-8">
      {/* Default Variants */}

      <div className="space-y-4">
        <Typography size={24} as="h2">
          유저 프로필 쇼케이스
        </Typography>
        {/* 
        <div className="space-y-2">
          {USER_PROFILES_DATA.map((userProfile) => (
            <UserProfile key={userProfile.name} {...userProfile} />
          ))}
        </div> */}
      </div>

      <div className="space-y-4">
        <Typography size={24} as="h2">
          아이콘 쇼케이스
        </Typography>

        <div className="space-y-2">
          <Icon name="camera" />
          <Icon name="chats" />
          <Icon name="pencil" />
          <Icon name="trophy" />
          <Icon name="user" />
        </div>
      </div>

      {/* Default Variants */}
      <div className="space-y-4">
        <Typography size={24}>Default Variants</Typography>

        <div className="space-y-2">
          <Typography size={18}>Large (기본)</Typography>
          <Button text="Large Default Button" />
        </div>

        <div className="space-y-2">
          <Typography size={18}>Small</Typography>
          <Button text="Small Default Button" size="small" />
        </div>
      </div>

      {/* Stroke Variants */}
      <div className="space-y-4">
        <Typography size={24}>Stroke Variants</Typography>

        <div className="space-y-2">
          <Typography size={18}>Large</Typography>
          <Button text="Large Stroke Button" variant="stroke" />
        </div>

        <div className="space-y-2">
          <Typography size={18}>Small</Typography>
          <Button text="Small Stroke Button" variant="stroke" size="small" />
        </div>
      </div>

      {/* States */}
      <div className="space-y-4">
        <Typography size={24}>Button States</Typography>

        <div className="space-y-2">
          <Typography size={18}>Disabled - Default</Typography>
          <Button text="Disabled Default" disabled />
        </div>

        <div className="space-y-2">
          <Typography size={18}>Disabled - Stroke</Typography>
          <Button text="Disabled Stroke" variant="stroke" disabled />
        </div>
      </div>

      {/* Custom Styles */}
      <div className="space-y-4">
        <Typography size={24}>Custom Styles</Typography>

        <div className="space-y-2">
          <Typography size={18}>커스텀 스타일</Typography>
          <Button text="Custom Button" className="bg-blue-500 hover:bg-blue-600 max-w-[200px]" />
        </div>
      </div>
    </div>
  );
};

export default PlayGround;

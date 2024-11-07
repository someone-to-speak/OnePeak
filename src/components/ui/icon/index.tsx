import React from "react";
import { ChatsTeardropIcon, PencilSimpleIcon, TrophyIcon } from "./Icons";
import { CameraIcon, UserIcon } from "lucide-react";

export type IconType = "trophy" | "user" | "pencil" | "camera" | "chats";

interface IconProps {
  name: IconType;
  size?: number;
  color?: string;
}

const iconComponents = {
  trophy: TrophyIcon,
  user: UserIcon,
  pencil: PencilSimpleIcon,
  camera: CameraIcon,
  chats: ChatsTeardropIcon
};

const Icon = ({ name, size = 32, color = "#343330" }: IconProps) => {
  const IconComponent = iconComponents[name];
  return <IconComponent size={size} color={color} />;
};

export default Icon;

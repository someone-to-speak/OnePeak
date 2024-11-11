import React from "react";
import { ArrowUp, CareLeft, ChatsTeardropIcon, DotThree, Pause, PencilSimpleIcon, Play, TrophyIcon } from "./Icons";
import { CameraIcon, UserIcon } from "lucide-react";

export type IconType =
  | "trophy"
  | "user"
  | "pencil"
  | "camera"
  | "chats"
  | "dotThree"
  | "careLeft"
  | "play"
  | "pause"
  | "arrowup";

interface IconProps {
  name: IconType;
  size?: number;
  color?: string;
  onClick?: () => void;
}

const iconComponents = {
  trophy: TrophyIcon,
  user: UserIcon,
  pencil: PencilSimpleIcon,
  camera: CameraIcon,
  chats: ChatsTeardropIcon,
  dotThree: DotThree,
  careLeft: CareLeft,
  play: Play,
  pause: Pause,
  arrowup: ArrowUp
};

const Icon = ({ name, size = 32, color = "#343330", onClick }: IconProps) => {
  const IconComponent = iconComponents[name];
  return <IconComponent size={size} color={color} onClick={onClick} />;
};

export default Icon;

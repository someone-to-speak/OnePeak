import React from "react";
import {
  ArrowUp,
  Camera,
  CareLeft,
  ChatsTeardropIcon,
  DotThree,
  Microphone,
  Pause,
  PencilSimpleIcon,
  Play,
  Power,
  TrophyIcon
} from "./Icons";
import { UserIcon } from "lucide-react";

export type IconType =
  | "trophy"
  | "user"
  | "pencil"
  | "chats"
  | "dotThree"
  | "careLeft"
  | "play"
  | "pause"
  | "arrowup"
  | "power"
  | "microphone"
  | "camera";

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
  chats: ChatsTeardropIcon,
  dotThree: DotThree,
  careLeft: CareLeft,
  play: Play,
  pause: Pause,
  arrowup: ArrowUp,
  power: Power,
  microphone: Microphone,
  camera: Camera
};

const Icon = ({ name, size = 32, color = "#343330", onClick }: IconProps) => {
  const IconComponent = iconComponents[name];
  return <IconComponent size={size} color={color} onClick={onClick} />;
};

export default Icon;

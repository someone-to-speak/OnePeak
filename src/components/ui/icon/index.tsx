import React from "react";
import {
  ArrowUp,
  CameraOn,
  CameraOff,
  CareLeft,
  ChatsTeardropIcon,
  DotThree,
  MicrophoneOn,
  MicrophoneOff,
  Pause,
  PencilSimpleIcon,
  Play,
  Power,
  Prohibit,
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
  | "microphoneOn"
  | "microphoneOff"
  | "cameraOn"
  | "cameraOff"
  | "prohibit";

interface IconProps {
  name: IconType;
  size?: number;
  color?: string;
  className?: string;
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
  microphoneOn: MicrophoneOn,
  microphoneOff: MicrophoneOff,
  cameraOn: CameraOn,
  cameraOff: CameraOff,
  prohibit: Prohibit
};

const Icon = ({ name, size = 32, color = "#343330", className, onClick }: IconProps) => {
  const IconComponent = iconComponents[name];
  return <IconComponent size={size} color={color} className={className} onClick={onClick} />;
};

export default Icon;

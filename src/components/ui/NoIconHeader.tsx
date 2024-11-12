"use client";

import { Typography } from "./typography";

interface BackButtonProps {
  title: string; // 버튼에 표시할 텍스트
}

const NoIconHeader: React.FC<BackButtonProps> = ({ title }) => {
  return (
    <div className="w-full h-12 justify-start items-center gap-1.5 inline-flex cursor-default">
      <Typography size={18} weight="bold">
        {title}
      </Typography>
    </div>
  );
};

export default NoIconHeader;

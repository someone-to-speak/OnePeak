"use client";

import { Typography } from "./typography";

interface BackButtonProps {
  title: string; // 버튼에 표시할 텍스트
}

const NoIconHeader: React.FC<BackButtonProps> = ({ title }) => {
  return (
    <div className="with-icon-header">
      <Typography size={18} weight="bold">
        {title}
      </Typography>
    </div>
  );
};

export default NoIconHeader;

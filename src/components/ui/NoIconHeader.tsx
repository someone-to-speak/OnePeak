"use client";

import { Typography } from "./typography";

interface BackButtonProps {
  title: string; // 버튼에 표시할 텍스트
}

const NoIconHeader: React.FC<BackButtonProps> = ({ title }) => {
  return (
    <div className="app-header">
      <Typography weight="bold" className="app-header-text">
        {title}
      </Typography>
    </div>
  );
};

export default NoIconHeader;
